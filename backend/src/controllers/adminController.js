const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { validate, schemas } = require('../utils/validators');
const { validatePhone, normalizeIndianPhone } = require('../utils/phone');
const { hashPhone } = require('../utils/encryption');
const {
  listContactSubmissions,
  getContactSubmissionById,
  updateContactSubmissionStatus,
  addContactSubmissionNote,
  archiveContactSubmission,
  deleteContactSubmission,
  listAppointmentBookings,
  getAppointmentBookingById,
  updateAppointmentStatus,
  addAppointmentNote,
  archiveAppointment,
  deleteAppointment,
  listCollegeInquiries,
  getCollegeInquiryById,
  updateCollegeInquiryStatus,
  addCollegeInquiryNote,
  archiveCollegeInquiry,
  deleteCollegeInquiry
} = require('../repositories/formsRepository');
const { getDatabase } = require('../database');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

const getContactSubmissions = asyncHandler(async (req, res, next) => {
  const { status, state, phone, name, from_date, to_date } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (state) filters.state = state;
  if (name) filters.name = name;
  if (from_date) filters.from_date = from_date;
  if (to_date) filters.to_date = to_date;

  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (phoneValidation.error) {
      return next(new AppError('Invalid phone number format', 400));
    }
    filters.phoneHash = hashPhone(phoneValidation.value);
  }

  const submissions = listContactSubmissions(filters);

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

const getContactSubmissionDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const submission = getContactSubmissionById(id);

  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }

  res.status(200).json({
    success: true,
    data: submission
  });
});

const updateContactStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validate(schemas.updateSubmissionStatus, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const submission = getContactSubmissionById(id);
  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }

  const updated = updateContactSubmissionStatus(id, value.status, 1);

  if (!updated) {
    return next(new AppError('Failed to update submission', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Submission status updated'
  });
});

const addContactNote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validate(schemas.addNote, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const submission = getContactSubmissionById(id);
  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }

  const note = {
    text: value.note,
    admin_name: req.admin.full_name,
    created_at: new Date().toISOString()
  };

  const added = addContactSubmissionNote(id, note);

  if (!added) {
    return next(new AppError('Failed to add note', 500));
  }

  res.status(201).json({
    success: true,
    message: 'Note added successfully'
  });
});

const archiveContact = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const submission = getContactSubmissionById(id);
  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }

  const archived = archiveContactSubmission(id);

  if (!archived) {
    return next(new AppError('Failed to archive submission', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Submission archived'
  });
});

const deleteContact = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Only super admins can delete submissions', 403));
  }

  const deleted = deleteContactSubmission(id);

  if (!deleted) {
    return next(new AppError('Submission not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Submission deleted'
  });
});

const getAppointments = asyncHandler(async (req, res, next) => {
  const { status, state, phone, name, from_date, to_date } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (state) filters.state = state;
  if (name) filters.name = name;
  if (from_date) filters.from_date = from_date;
  if (to_date) filters.to_date = to_date;

  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (phoneValidation.error) {
      return next(new AppError('Invalid phone number format', 400));
    }
    filters.phoneHash = hashPhone(phoneValidation.value);
  }

  const appointments = listAppointmentBookings(filters);

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

const getAppointmentDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const appointment = getAppointmentBookingById(id);

  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

const updateAppointmentStatusHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validate(schemas.updateSubmissionStatus, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const appointment = getAppointmentBookingById(id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  const updated = updateAppointmentStatus(id, value.status);

  if (!updated) {
    return next(new AppError('Failed to update appointment', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Appointment status updated'
  });
});

const addAppointmentNoteHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validate(schemas.addNote, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const appointment = getAppointmentBookingById(id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  const note = {
    text: value.note,
    admin_name: req.admin.full_name,
    created_at: new Date().toISOString()
  };

  const added = addAppointmentNote(id, note);

  if (!added) {
    return next(new AppError('Failed to add note', 500));
  }

  res.status(201).json({
    success: true,
    message: 'Note added successfully'
  });
});

const archiveAppointmentHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = getAppointmentBookingById(id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  const archived = archiveAppointment(id);

  if (!archived) {
    return next(new AppError('Failed to archive appointment', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Appointment archived'
  });
});

const deleteAppointmentHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Only super admins can delete appointments', 403));
  }

  const deleted = deleteAppointment(id);

  if (!deleted) {
    return next(new AppError('Appointment not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Appointment deleted'
  });
});

const getCollegeInquiries = asyncHandler(async (req, res, next) => {
  const { status, state, phone, name, from_date, to_date } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (state) filters.state = state;
  if (name) filters.name = name;
  if (from_date) filters.from_date = from_date;
  if (to_date) filters.to_date = to_date;

  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (phoneValidation.error) {
      return next(new AppError('Invalid phone number format', 400));
    }
    filters.phoneHash = hashPhone(phoneValidation.value);
  }

  const inquiries = listCollegeInquiries(filters);

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

const getCollegeInquiryDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const inquiry = getCollegeInquiryById(id);

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  res.status(200).json({
    success: true,
    data: inquiry
  });
});

const updateCollegeInquiryStatusHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validate(schemas.updateSubmissionStatus, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const inquiry = getCollegeInquiryById(id);
  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  const updated = updateCollegeInquiryStatus(id, value.status);

  if (!updated) {
    return next(new AppError('Failed to update inquiry', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Inquiry status updated'
  });
});

const addCollegeInquiryNoteHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validate(schemas.addNote, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const inquiry = getCollegeInquiryById(id);
  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  const note = {
    text: value.note,
    admin_name: req.admin.full_name,
    created_at: new Date().toISOString()
  };

  const added = addCollegeInquiryNote(id, note);

  if (!added) {
    return next(new AppError('Failed to add note', 500));
  }

  res.status(201).json({
    success: true,
    message: 'Note added successfully'
  });
});

const archiveCollegeInquiryHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const inquiry = getCollegeInquiryById(id);
  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  const archived = archiveCollegeInquiry(id);

  if (!archived) {
    return next(new AppError('Failed to archive inquiry', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Inquiry archived'
  });
});

const deleteCollegeInquiryHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Only super admins can delete inquiries', 403));
  }

  const deleted = deleteCollegeInquiry(id);

  if (!deleted) {
    return next(new AppError('Inquiry not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Inquiry deleted'
  });
});

const getDashboardStats = asyncHandler(async (req, res, next) => {
  const db = getDatabase();

  const contactStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM contact_submissions
    WHERE archived = 0
  `).get();

  const appointmentStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM appointment_bookings
    WHERE archived = 0
  `).get();

  const collegeInquiryStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM college_inquiries
    WHERE archived = 0
  `).get();

  const newsletterStats = db.prepare(`
    SELECT COUNT(*) as total
    FROM newsletter_subscriptions
    WHERE status = 'subscribed'
  `).get();

  res.status(200).json({
    success: true,
    data: {
      contacts: contactStats,
      appointments: appointmentStats,
      college_inquiries: collegeInquiryStats,
      newsletter_subscribers: newsletterStats.total
    }
  });
});

const exportData = asyncHandler(async (req, res, next) => {
  const { type, format } = req.query;

  if (!['csv', 'xlsx'].includes(format)) {
    return next(new AppError('Invalid export format. Use csv or xlsx', 400));
  }

  let data = [];
  let filename = '';

  if (type === 'contacts') {
    data = listContactSubmissions();
    filename = `contacts_export_${Date.now()}`;
  } else if (type === 'appointments') {
    data = listAppointmentBookings();
    filename = `appointments_export_${Date.now()}`;
  } else if (type === 'inquiries') {
    data = listCollegeInquiries();
    filename = `college_inquiries_export_${Date.now()}`;
  } else {
    return next(new AppError('Invalid export type', 400));
  }

  if (format === 'csv') {
    const parser = new Parser();
    const csv = parser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
    return res.send(csv);
  }

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map(key => ({
        header: key.toUpperCase(),
        key,
        width: 20
      }));

      data.forEach(row => worksheet.addRow(row));
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  }
});

module.exports = {
  getContactSubmissions,
  getContactSubmissionDetails,
  updateContactStatus,
  addContactNote,
  archiveContact,
  deleteContact,
  getAppointments,
  getAppointmentDetails,
  updateAppointmentStatusHandler,
  addAppointmentNoteHandler,
  archiveAppointmentHandler,
  deleteAppointmentHandler,
  getCollegeInquiries,
  getCollegeInquiryDetails,
  updateCollegeInquiryStatusHandler,
  addCollegeInquiryNoteHandler,
  archiveCollegeInquiryHandler,
  deleteCollegeInquiryHandler,
  getDashboardStats,
  exportData
};
