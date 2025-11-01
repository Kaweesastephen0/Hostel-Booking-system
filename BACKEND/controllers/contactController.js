import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Get client IP address
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Create contact form submission
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent') || 'Unknown'
    });

    await contact.save();

    // Send confirmation email (optional)
    try {
      await sendConfirmationEmail(name, email, subject);
    } catch (emailError) {
      console.log('Email sending failed, but contact form was saved:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
};

// Send confirmation email (optional)
const sendConfirmationEmail = async (name, email, subject) => {
  // Only send emails if email configuration is provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return;
  }

  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Muk-Book Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting Muk-Book',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Contacting Muk-Book!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding: <strong>${subject}</strong></p>
        <p>Our team will review your inquiry and get back to you within 24 hours.</p>
        <div style="background-color: #f8fbff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Need immediate assistance?</strong></p>
          <p style="margin: 5px 0;">📞 Call: +256 709 167919</p>
          <p style="margin: 5px 0;">💬 WhatsApp: +256 759 546308</p>
          <p style="margin: 5px 0;">📧 Email: support@mukbook.ug</p>
        </div>
        <p>Best regards,<br>The Muk-Book Team</p>
        <hr style="border: none; border-top: 1px solid #e0f2fe; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Get all contact submissions (for admin panel)
const getContactSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submissions'
    });
  }
};

// Get single contact submission
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submission'
    });
  }
};

// Update contact status
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact submission'
    });
  }
};

export {
  submitContactForm,
  getContactSubmissions,
  getContactById,
  updateContactStatus
};