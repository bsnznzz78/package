const express = require('express');
const {
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
} = require('../controllers/adminController');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard/stats', getDashboardStats);

router.get('/contact-submissions', getContactSubmissions);
router.get('/contact-submissions/:id', getContactSubmissionDetails);
router.patch('/contact-submissions/:id/status', updateContactStatus);
router.post('/contact-submissions/:id/notes', addContactNote);
router.post('/contact-submissions/:id/archive', archiveContact);
router.delete('/contact-submissions/:id', authorize('super_admin'), deleteContact);

router.get('/appointment-bookings', getAppointments);
router.get('/appointment-bookings/:id', getAppointmentDetails);
router.patch('/appointment-bookings/:id/status', updateAppointmentStatusHandler);
router.post('/appointment-bookings/:id/notes', addAppointmentNoteHandler);
router.post('/appointment-bookings/:id/archive', archiveAppointmentHandler);
router.delete('/appointment-bookings/:id', authorize('super_admin'), deleteAppointmentHandler);

router.get('/college-inquiries', getCollegeInquiries);
router.get('/college-inquiries/:id', getCollegeInquiryDetails);
router.patch('/college-inquiries/:id/status', updateCollegeInquiryStatusHandler);
router.post('/college-inquiries/:id/notes', addCollegeInquiryNoteHandler);
router.post('/college-inquiries/:id/archive', archiveCollegeInquiryHandler);
router.delete('/college-inquiries/:id', authorize('super_admin'), deleteCollegeInquiryHandler);

router.get('/export', exportData);

module.exports = router;
