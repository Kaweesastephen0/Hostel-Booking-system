import frontUser from '../models/User.js';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Async email queue helper - sends emails without blocking response
const queueEmail = async (emailData) => {
  setImmediate(async () => {
    try {
      await sgMail.send(emailData);
      console.log(`Email sent successfully to ${emailData.to}`);
    } catch (error) {
      console.error(`Failed to send email to ${emailData.to}:`, error.response ? error.response.body : error.message);
    }
  });
};

//token creation
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

//user registration checking if email, studentnumber and nin if already exists
export const register = async (req, res) => {
  try {
    const { firstName, surname, email, gender, userType, studentNumber, nin, password } = req.body;

    const userExists = await frontUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (userType === 'student' && studentNumber) {
      const studentExists = await frontUser.findOne({ studentNumber });
      if (studentExists) {
        return res.status(400).json({ message: 'Student number already registered' });
      }
    }

    if (userType === 'non-student' && nin) {
      const ninExists = await frontUser.findOne({ nin });
      if (ninExists) {
        return res.status(400).json({ message: 'NIN already registered' });
      }
    }

    const user = await frontUser.create({
      firstName,
      surname,
      email,
      gender,
      userType,
      studentNumber: userType === 'student' ? studentNumber : undefined,
      nin: userType === 'non-student' ? nin : undefined,
      password
    });

    if (user) {
      const loginUrl = `${process.env.FRONTEND_URL}/auth`;

      const welcomeMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; border: 1px solid #ddd; }
            .button { background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${process.env.APP_NAME}!</h1>
            </div>
            <div class="content">
              <p>Hello ${user.gender === 'Male' ? 'Mr.' : 'Ms.'} ${user.firstName} ${user.surname},</p>
              <p>Thank you for registering with ${process.env.APP_NAME} Hostel Booking System!</p>
              <p>Your account has been successfully created. You can now login and start booking your ideal accommodation.</p>
              <p><strong>Account Details:</strong></p>
              <ul>
                <li>Name: ${user.firstName} ${user.surname}</li>
                <li>Gender: ${user.gender}</li>
                <li>Email: ${user.email}</li>
                <li>Account Type: ${user.userType === 'student' ? 'Student' : 'Non-Student'}</li>
                ${user.userType === 'student' ? `<li>Student Number: ${user.studentNumber}</li>` : ''}
              </ul>
              <p style="text-align: center;">
                <a href="${loginUrl}" class="button">Click Here to Login</a>
              </p>
              <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="color: #2563eb; word-break: break-all;">${loginUrl}</p>
              <p>If you have any questions, please don't hesitate to contact us at ${process.env.SUPPORT_PHONE}.</p>
            </div>
            <div class="footer">
              <p>${process.env.APP_NAME} Hostel Booking System</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Welcome to ${process.env.APP_NAME} - Registration Successful`,
        html: welcomeMessage,
        text: `Welcome to ${process.env.APP_NAME}!\n\nHello ${user.firstName} ${user.surname},\n\nThank you for registering with ${process.env.APP_NAME} Hostel Booking System!\n\nYour account has been successfully created.`
      };

      // Queue email asynchronously - doesn't block response
      queueEmail(msg);

      const token = generateToken(user._id);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        gender: user.gender,
        userType: user.userType,
        studentNumber: user.studentNumber,
        createdAt: user.createdAt
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await frontUser.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      user.lastLogin = Date.now();
      await user.save();

      const token = generateToken(user._id);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        gender: user.gender,
        userType: user.userType,
        studentNumber: user.studentNumber,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await frontUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRE);

    await user.save();

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
            <p><strong>This code will expire in ${parseInt(process.env.RESET_TOKEN_EXPIRE) / 60000} minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>Hostel Booking System - Automated Message</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Password Reset Code - ${process.env.APP_NAME}`,
      html: message,
      text: `Password Reset Request\n\nYou requested a password reset for your ${process.env.APP_NAME} account.\n\nYour reset code is: ${resetToken}\n\nThis code will expire in ${parseInt(process.env.RESET_TOKEN_EXPIRE) / 60000} minutes.\n\nIf you didn't request this, please ignore this email.`
    };

    // Queue email asynchronously - doesn't block response
    queueEmail(msg);

    // Respond immediately without waiting for email
    res.status(200).json({
      message: 'Reset code sent to email',
      success: true
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An error occurred during password reset' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    const user = await frontUser.findOne({
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
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An error occurred during password reset' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await frontUser.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, surname, userType, studentNumber, nin } = req.body;

    if (userType !== user.userType) {
      if (userType === 'student' && studentNumber) {
        const existingStudent = await frontUser.findOne({
          studentNumber,
          _id: { $ne: user._id }
        });
        if (existingStudent) {
          return res.status(400).json({ message: 'Student number already registered' });
        }
      }

      if (userType === 'non-student' && nin) {
        const existingNin = await frontUser.findOne({
          nin,
          _id: { $ne: user._id }
        });
        if (existingNin) {
          return res.status(400).json({ message: 'NIN already registered' });
        }
      }
    } else {
      if (userType === 'student' && studentNumber && studentNumber !== user.studentNumber) {
        const existingStudent = await frontUser.findOne({
          studentNumber,
          _id: { $ne: user._id }
        });
        if (existingStudent) {
          return res.status(400).json({ message: 'Student number already registered' });
        }
      }

      if (userType === 'non-student' && nin && nin !== user.nin) {
        const existingNin = await frontUser.findOne({
          nin,
          _id: { $ne: user._id }
        });
        if (existingNin) {
          return res.status(400).json({ message: 'NIN already registered' });
        }
      }
    }

    user.firstName = firstName;
    user.surname = surname;
    user.userType = userType;

    if (userType === 'student') {
      user.studentNumber = studentNumber;
      user.nin = undefined;
    } else {
      user.nin = nin;
      user.studentNumber = undefined;
    }

    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      gender: user.gender,
      userType: user.userType,
      studentNumber: user.studentNumber,
      nin: user.nin,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'An error occurred during profile update' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await frontUser.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { oldPassword, newPassword } = req.body;

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'An error occurred during password change' });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 0
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'An error occurred during logout' });
  }
};