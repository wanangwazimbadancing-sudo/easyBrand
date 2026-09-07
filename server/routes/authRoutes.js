import express from 'express';
import { generateSecret, generate } from 'otplib';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../config/mailer.js';

const router = express.Router();

const ADMIN_EMAIL = 'wanangwazimbadancing@gmail.com';
const ADMIN_PASSWORD = '199202hH@!';
const SECRET_KEY = process.env.JWT_SECRET || 'happy-zimba-admin-jwt-secret-2026';

// Store for OTP sessions (in production, use Redis or database)
const otpSessions = new Map();

// Step 1: Request OTP (submit email & password)
router.post('/request-otp', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate OTP code
    const secret = generateSecret();
    const otp = String(await generate({ secret }));
    const sessionId = Math.random().toString(36).substring(7);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Store the session (expires in 5 minutes)
    otpSessions.set(sessionId, {
      otp,
      email,
      createdAt: Date.now(),
      expiresAt,
    });

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      otpSessions.delete(sessionId);
      return res.status(500).json({ 
        message: 'Failed to send OTP. Please check your email configuration.',
        error: emailError.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      sessionId,
      expiresAt,
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { sessionId, otp } = req.body;
    const normalizedOtp = String(otp ?? '').trim();

    if (!sessionId || !normalizedOtp) {
      return res.status(400).json({ message: 'Session ID and OTP required' });
    }

    const session = otpSessions.get(sessionId);

    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    if (Date.now() > session.expiresAt) {
      otpSessions.delete(sessionId);
      return res.status(401).json({ message: 'OTP expired' });
    }

    // Simple direct comparison of the stored OTP with the provided one
    console.log(`Comparing OTP: stored="${session.otp}" vs provided="${normalizedOtp}"`);
    
    if (normalizedOtp !== session.otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // OTP verified successfully - generate JWT token
    const token = jwt.sign(
      { email: session.email, role: 'admin' },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Clean up the session
    otpSessions.delete(sessionId);

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out' });
});

export default router;
