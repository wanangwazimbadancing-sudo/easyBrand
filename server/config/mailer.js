import nodemailer from 'nodemailer';

let transporter = null;

const initTransporter = () => {
  if (!transporter) {
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;

    if (!mailUser || !mailPassword) {
      console.warn('Email credentials not configured. OTP email sending disabled.');
      return null;
    }

    transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE || 'gmail',
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    });
  }
  return transporter;
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailer = initTransporter();
    
    if (!mailer) {
      throw new Error('Email transporter not configured. Please set MAIL_USER and MAIL_PASSWORD in .env');
    }

    const otpCode = String(otp).trim();

    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: email,
      subject: 'Happy Zimba - Your One-Time Password (OTP)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #f8f9fa; padding: 30px 20px; border-bottom: 1px solid #e0e0e0; }
            .content { padding: 30px 20px; }
            .otp-box { background-color: #f0f7ff; border: 2px solid #008080; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; }
            .otp-label { color: #666; font-size: 14px; margin-bottom: 15px; font-weight: normal; }
            .otp-code { font-size: 56px; font-weight: bold; color: #008080; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 15px 0; word-break: break-all; }
            .otp-expiry { color: #d9534f; font-size: 12px; margin-top: 15px; font-weight: bold; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
            .warning { color: #666; font-size: 14px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="color: #333; margin: 0;">Welcome to Happy Zimba</h2>
            </div>
            
            <div class="content">
              <p style="color: #666; font-size: 16px;">
                You've requested to log in to your admin account. Use the code below to complete your login.
              </p>
              
              <div class="otp-box">
                <div class="otp-label">Your One-Time Password:</div>
                <div class="otp-code">${otpCode}</div>
                <div class="otp-expiry">⏱️ Expires in 5 minutes</div>
              </div>

              <p class="warning">
                ⚠️ If you didn't request this code, you can safely ignore this email. Do not share this code with anyone.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">© 2026 Happy Zimba. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your Happy Zimba Admin OTP: ${otpCode}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
    };

    console.log(`Sending OTP email to ${email} with code: ${otpCode}`);
    const info = await mailer.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw error;
  }
};

export default transporter;
