import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { firstName, surname, email, userType, studentNumber, nin, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (userType === 'student' && studentNumber) {
      const studentExists = await User.findOne({ studentNumber });
      if (studentExists) {
        return res.status(400).json({ message: 'Student number already registered' });
      }
    }

    if (userType === 'non-student' && nin) {
      const ninExists = await User.findOne({ nin });
      if (ninExists) {
        return res.status(400).json({ message: 'NIN already registered' });
      }
    }

    const user = await User.create({
      firstName,
      surname,
      email,
      userType,
      studentNumber: userType === 'student' ? studentNumber : undefined,
      nin: userType === 'non-student' ? nin : undefined,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // ========== EMAIL TRANSPORTER CONFIGURATION ==========
    // This is where we set up the email service (Gmail)
    // REPLACE 'your-email@gmail.com' and 'your-app-password' with your actual credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use 'outlook', 'yahoo', etc.
      auth: {
        user: 'your-email@gmail.com', // ← PUT YOUR ACTUAL EMAIL HERE
        pass: 'your-app-password'      // ← PUT YOUR APP PASSWORD HERE (NOT normal Gmail password)
      },
      // Add these options for better reliability
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email server is ready to send messages');
    } catch (verifyError) {
      console.error('Email server verification failed:', verifyError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ 
        message: 'Email service configuration error. Please contact administrator.',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .code-box { background-color: #fff; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${user.firstName},</p>
            <p>You requested a password reset for your Hostel Booking System account.</p>
            <div class="code-box">
              <p>Your reset code is:</p>
              <div class="code">${resetToken}</div>
            </div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>Hostel Booking System - Automated Message</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ========== SEND THE EMAIL ==========
    // mailOptions - This is where we specify email details
    try {
      const info = await transporter.sendMail({
        from: '"Hostel Booking System" <your-email@gmail.com>', // ← PUT YOUR ACTUAL EMAIL HERE
        to: user.email, // Recipient: the user's email address
        subject: 'Password Reset Code - Hostel Booking System', // Email subject
        html: message, // HTML version of the email
        // Add text version as fallback
        text: `Password Reset Request\n\nYou requested a password reset for your Hostel Booking System account.\n\nYour reset code is: ${resetToken}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
      });

      console.log('Password reset email sent successfully:', info.messageId);
      res.status(200).json({ 
        message: 'Reset code sent to email',
        success: true
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ 
        message: 'Failed to send reset code. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};