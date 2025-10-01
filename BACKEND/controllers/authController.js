const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
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

exports.forgotPassword = async (req, res) => {
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const message = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset for your Hostel Booking System account.</p>
      <p>Your reset code is: <strong>${resetToken}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Code - Hostel Booking System',
        html: message
      });

      res.status(200).json({ message: 'Reset code sent to email' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
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
