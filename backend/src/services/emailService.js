const nodemailer = require('nodemailer');
const config = require('../config');

const createTransporter = () => {
  if (!config.email.user || !config.email.password) {
    console.warn('Email configuration missing. Email sending disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('Email would be sent:', { to, subject });
    return { success: false, message: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      text,
      html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendContactConfirmation = async (name, email) => {
  const subject = 'Thank you for contacting RBC Counselling';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0066cc;">Thank You for Contacting Us!</h2>
      <p>Dear ${name},</p>
      <p>We have received your inquiry and appreciate you reaching out to RBC Counselling Consultancy.</p>
      <p>Our counselling experts will review your message and get back to you within 24 hours.</p>
      <p>In the meantime, feel free to explore our <a href="${config.frontendUrl}/services.html">services</a> or check out our <a href="${config.frontendUrl}/colleges.html">college listings</a>.</p>
      <br>
      <p>Best regards,<br>RBC Counselling Team</p>
      <hr style="border: 1px solid #eee; margin-top: 30px;">
      <p style="font-size: 12px; color: #777;">
        RBC Counselling Consultancy<br>
        Phone: +91 98765 43210<br>
        Email: info@rbccounselling.com
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

const sendAppointmentConfirmation = async (name, email, date, time) => {
  const subject = 'Appointment Booking Confirmation - RBC Counselling';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00a86b;">Appointment Booked Successfully!</h2>
      <p>Dear ${name},</p>
      <p>Your appointment request has been received. Here are the details:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      </div>
      <p>Our team will confirm your appointment via phone within 2 hours. Please keep your phone accessible.</p>
      <p>If you need to reschedule, please contact us at +91 98765 43210.</p>
      <br>
      <p>Best regards,<br>RBC Counselling Team</p>
      <hr style="border: 1px solid #eee; margin-top: 30px;">
      <p style="font-size: 12px; color: #777;">
        RBC Counselling Consultancy<br>
        Phone: +91 98765 43210<br>
        Email: info@rbccounselling.com
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

const sendAdminNotification = async (type, data) => {
  if (!config.email.adminNotification) {
    console.log('Admin notification email not configured');
    return { success: false };
  }

  let subject = '';
  let html = '';

  if (type === 'contact') {
    subject = `New Contact Form Submission from ${data.name}`;
    html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>State:</strong> ${data.state || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
      </div>
    `;
  } else if (type === 'appointment') {
    subject = `New Appointment Booking from ${data.name}`;
    html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Appointment Booking</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Preferred Date:</strong> ${data.preferred_date}</p>
        <p><strong>Preferred Time:</strong> ${data.preferred_time}</p>
        <p><strong>College Preference:</strong> ${data.college_preference || 'Not specified'}</p>
        <p><strong>State:</strong> ${data.state || 'Not provided'}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
      </div>
    `;
  } else if (type === 'college_inquiry') {
    subject = `New College Inquiry from ${data.name}`;
    html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>New College Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>College:</strong> ${data.college_name || 'Not specified'}</p>
        <p><strong>Course:</strong> ${data.course || 'Not specified'}</p>
        <p><strong>State:</strong> ${data.state || 'Not provided'}</p>
        <p><strong>Message:</strong> ${data.message || 'N/A'}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
      </div>
    `;
  }

  return sendEmail({ to: config.email.adminNotification, subject, html });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${config.frontendUrl}/reset-password.html?token=${resetToken}`;
  const subject = 'Password Reset Request - RBC Counselling Admin';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0066cc;">Password Reset Request</h2>
      <p>You requested a password reset for your RBC Counselling admin account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; 
                  border-radius: 8px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>This link will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>RBC Counselling Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

module.exports = {
  sendEmail,
  sendContactConfirmation,
  sendAppointmentConfirmation,
  sendAdminNotification,
  sendPasswordResetEmail
};
