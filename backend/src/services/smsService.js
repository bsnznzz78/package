const config = require('../config');

let twilioClient = null;

if (config.sms.enabled && config.sms.accountSid && config.sms.authToken) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(config.sms.accountSid, config.sms.authToken);
    console.log('✅ Twilio SMS service initialized');
  } catch (error) {
    console.warn('⚠️ Twilio not configured properly:', error.message);
  }
}

const sendSMS = async (to, message) => {
  if (!twilioClient) {
    console.log('SMS would be sent to', to, ':', message);
    return { success: false, message: 'SMS service not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: config.sms.fromNumber,
      to
    });

    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

const sendOTP = async (phone, otp) => {
  const message = `Your RBC Counselling verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS(phone, message);
};

const sendAdminSMSAlert = async (type, data) => {
  if (!config.sms.adminPhone) {
    return { success: false, message: 'Admin phone not configured' };
  }

  let message = '';

  if (type === 'urgent_appointment') {
    message = `URGENT: New appointment from ${data.name} (${data.phone}) on ${data.preferred_date} at ${data.preferred_time}`;
  } else if (type === 'new_contact') {
    message = `New contact form from ${data.name} (${data.phone})`;
  }

  if (message) {
    return sendSMS(config.sms.adminPhone, message);
  }

  return { success: false };
};

module.exports = {
  sendSMS,
  sendOTP,
  sendAdminSMSAlert
};
