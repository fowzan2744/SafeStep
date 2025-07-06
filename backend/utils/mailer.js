const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `MyApp <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<div style="font-family:sans-serif">
             <h2>Your OTP is <span style="color:#6366f1;">${otp}</span></h2>
             <p>Use this code to complete your registration. It is valid for 5 minutes.</p>
           </div>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
