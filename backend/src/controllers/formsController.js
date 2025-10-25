const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { validate, schemas } = require('../utils/validators');
const { validatePhone } = require('../utils/phone');
const {
  createContactSubmission,
  createAppointmentBooking,
  createNewsletterSubscription,
  createCollegeInquiry
} = require('../repositories/formsRepository');
const {
  sendContactConfirmation,
  sendAppointmentConfirmation,
  sendAdminNotification
} = require('../services/emailService');
const { sendAdminSMSAlert } = require('../services/smsService');

const handleContactForm = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.contactForm, req.body);
  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const phoneValidation = validatePhone(value.phone);
  if (phoneValidation.error) {
    return next(new AppError(phoneValidation.error, 400));
  }

  const payload = {
    ...value,
    phone: phoneValidation.value
  };

  const submission = await createContactSubmission(payload);

  await sendContactConfirmation(submission.name, submission.email);
  await sendAdminNotification('contact', submission);
  await sendAdminSMSAlert('new_contact', submission);

  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully'
  });
});

const handleAppointmentForm = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.appointmentBooking, req.body);
  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const phoneValidation = validatePhone(value.phone);
  if (phoneValidation.error) {
    return next(new AppError(phoneValidation.error, 400));
  }

  const payload = {
    ...value,
    phone: phoneValidation.value
  };

  const booking = await createAppointmentBooking(payload);

  await sendAppointmentConfirmation(booking.name, booking.email, booking.preferred_date, booking.preferred_time);
  await sendAdminNotification('appointment', booking);
  await sendAdminSMSAlert('urgent_appointment', booking);

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully'
  });
});

const handleNewsletterSubscription = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.newsletterSubscription, req.body);
  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  let phone = null;
  if (value.phone) {
    const phoneValidation = validatePhone(value.phone);
    if (phoneValidation.error) {
      return next(new AppError(phoneValidation.error, 400));
    }
    phone = phoneValidation.value;
  }

  await createNewsletterSubscription({
    email: value.email,
    name: value.name,
    phone
  });

  res.status(201).json({
    success: true,
    message: 'Subscribed to newsletter successfully'
  });
});

const handleCollegeInquiry = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.collegeInquiry, req.body);
  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const phoneValidation = validatePhone(value.phone);
  if (phoneValidation.error) {
    return next(new AppError(phoneValidation.error, 400));
  }

  const inquiry = await createCollegeInquiry({
    ...value,
    phone: phoneValidation.value
  });

  await sendAdminNotification('college_inquiry', inquiry);

  res.status(201).json({
    success: true,
    message: 'College inquiry submitted successfully'
  });
});

module.exports = {
  handleContactForm,
  handleAppointmentForm,
  handleNewsletterSubscription,
  handleCollegeInquiry
};
