// utils/email.js
const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or your email service provider (e.g., 'SendGrid', 'Mailgun')
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for security
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: to,
      subject: subject,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Indicate failure
  }
};

module.exports = { sendEmail };