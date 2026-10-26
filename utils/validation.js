const Joi = require('joi');

// Common reusable schemas
const idSchema = Joi.string().uuid().required();
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();
const emailSchema = Joi.string().email().lowercase().trim().required();
const passwordSchema = Joi.string().min(6).max(128).required();
const phoneSchema = Joi.string().pattern(/^[0-9+\-\s()]{7,20}$/).optional();
const nameSchema = Joi.string().trim().min(2).max(100).required();
const optionalString = Joi.string().trim().optional();

// ==========================================
// AUTH SCHEMAS
// ==========================================

const registerPatientSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  address: Joi.string().trim().max(200).optional()
});

const registerDoctorSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  address: Joi.string().trim().max(200).optional(),
  specialty: Joi.string().trim().min(2).max(100).required(),
  title: Joi.string().trim().max(100).optional(),
  phone_number: phoneSchema,
  working_hours: Joi.string().trim().max(200).optional()
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().min(1).required()
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: emailSchema
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  new_password: passwordSchema
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: passwordSchema
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required()
});

const verify2faSchema = Joi.object({
  token: Joi.string().pattern(/^\d{6}$/).required()
});

// ==========================================
// USER PROFILE SCHEMAS
// ==========================================

const updateProfileSchema = Joi.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  address: Joi.string().trim().max(200).optional(),
  birth_date: Joi.date().iso().optional(),
  image_profile: Joi.string().uri().optional()
});

// ==========================================
// DOCTOR PORTFOLIO SCHEMAS
// ==========================================

const createDoctorPortfolioSchema = Joi.object({
  doctor_name: nameSchema,
  specialty: Joi.string().trim().min(2).max(100).required(),
  title: Joi.string().trim().max(100).optional(),
  phone_number: phoneSchema,
  working_hours: Joi.string().trim().max(200).optional()
});

const updateDoctorPortfolioSchema = Joi.object({
  doctor_name: nameSchema.optional(),
  specialty: Joi.string().trim().min(2).max(100).optional(),
  title: Joi.string().trim().max(100).optional(),
  phone_number: phoneSchema,
  working_hours: Joi.string().trim().max(200).optional(),
  background_image: Joi.string().uri().optional(),
  profile_image: Joi.string().uri().optional()
});

// ==========================================
// DOCTOR WORK (SERVICE) SCHEMAS
// ==========================================

const createDoctorWorkSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  price: Joi.number().positive().max(100000).optional(),
  description: Joi.string().trim().max(1000).optional(),
  duration_session: Joi.number().integer().min(5).max(480).optional(),
  working_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
});

const updateDoctorWorkSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).optional(),
  price: Joi.number().positive().max(100000).optional(),
  description: Joi.string().trim().max(1000).optional(),
  duration_session: Joi.number().integer().min(5).max(480).optional(),
  working_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  status: Joi.string().valid('pending', 'active', 'rejected').optional()
});

// ==========================================
// BOOKING SCHEMAS
// ==========================================

const createBookingSchema = Joi.object({
  portfolio_id: objectIdSchema.required(),
  type: Joi.string().valid('booking', 'consulting').required(),
  total_patients: Joi.number().integer().min(1).max(1000).default(50),
  appointment_date: Joi.date().iso().required(),
  appointment_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
});

const updateBookingSchema = Joi.object({
  type: Joi.string().valid('booking', 'consulting').optional(),
  total_patients: Joi.number().integer().min(1).max(1000).optional(),
  status: Joi.string().valid('pending', 'active', 'expired', 'cancelled').optional(),
  appointment_date: Joi.date().iso().optional(),
  appointment_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
});

// ==========================================
// BOOKING ITEM SCHEMAS
// ==========================================

const createBookingItemSchema = Joi.object({
  booking_id: objectIdSchema.required(),
  user_id: objectIdSchema.required(),
  queue_number: Joi.number().integer().min(1).max(1000).required(),
  patient_name: nameSchema.optional(),
  patient_phone: phoneSchema,
  patient_age: Joi.number().integer().min(0).max(120).optional(),
  patient_address: Joi.string().trim().max(200).optional(),
  status: Joi.string().valid('pending', 'accepted', 'rejected', 'completed', 'cancelled').optional(),
  type: Joi.string().valid('booking', 'consulting').optional()
});

const updateBookingItemSchema = Joi.object({
  queue_number: Joi.number().integer().min(1).max(1000).optional(),
  status: Joi.string().valid('pending', 'accepted', 'rejected', 'completed', 'cancelled').optional(),
  type: Joi.string().valid('booking', 'consulting').optional()
});

// ==========================================
// REVIEW SCHEMAS
// ==========================================

const createReviewSchema = Joi.object({
  portfolio_id: objectIdSchema.required(),
  feedback: Joi.string().trim().max(1000).optional(),
  rating: Joi.number().integer().min(1).max(5).required()
});

const updateReviewSchema = Joi.object({
  feedback: Joi.string().trim().max(1000).optional(),
  rating: Joi.number().integer().min(1).max(5).optional()
});

// ==========================================
// REPORT SCHEMAS
// ==========================================

const createReportSchema = Joi.object({
  portfolio_id: objectIdSchema.required(),
  description: Joi.string().trim().max(2000).optional(),
  medicines: Joi.array().items(Joi.string().trim().max(100)).max(50).optional()
});

const updateReportSchema = Joi.object({
  description: Joi.string().trim().max(2000).optional(),
  medicines: Joi.array().items(Joi.string().trim().max(100)).max(50).optional()
});

// ==========================================
// NOTIFICATION SCHEMAS
// ==========================================

const createNotificationSchema = Joi.object({
  user_id: objectIdSchema.required(),
  type: Joi.string().valid(
    'queue_update',
    'booking_accepted',
    'booking_rejected',
    'turn_warning',
    'appointment_cancelled',
    'doctor_verified',
    'deletion_request_update',
    'system'
  ).required(),
  title: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(1).max(1000).required(),
  related_entity_type: Joi.string().trim().max(50).optional(),
  related_entity_id: Joi.string().trim().max(100).optional()
});

const updateNotificationSchema = Joi.object({
  is_read: Joi.boolean().required()
});

// ==========================================
// DELETION REQUEST SCHEMAS
// ==========================================

const createDeletionRequestSchema = Joi.object({
  reason: Joi.string().trim().min(1).max(500).optional()
});

const decideDeletionRequestSchema = Joi.object({
  decision: Joi.string().valid('approved', 'rejected').required(),
  reason: Joi.string().trim().max(500).optional()
});

// ==========================================
// PAGINATION & QUERY SCHEMAS
// ==========================================

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  include_deleted: Joi.boolean().optional()
});

const objectIdParamSchema = Joi.object({
  id: objectIdSchema.required()
});

const bookingItemIdParamSchema = Joi.object({
  bookingItemId: objectIdSchema.required()
});

const doctorIdParamSchema = Joi.object({
  id: objectIdSchema.required()
});

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // Common
  idSchema,
  objectIdSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  nameSchema,
  optionalString,
  paginationSchema,
  objectIdParamSchema,
  bookingItemIdParamSchema,
  doctorIdParamSchema,

  // Auth
  registerPatientSchema,
  registerDoctorSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  verify2faSchema,

  // User profile
  updateProfileSchema,

  // Doctor portfolio
  createDoctorPortfolioSchema,
  updateDoctorPortfolioSchema,

  // Doctor work
  createDoctorWorkSchema,
  updateDoctorWorkSchema,

  // Booking
  createBookingSchema,
  updateBookingSchema,

  // Booking item
  createBookingItemSchema,
  updateBookingItemSchema,

  // Review
  createReviewSchema,
  updateReviewSchema,

  // Report
  createReportSchema,
  updateReportSchema,

  // Notification
  createNotificationSchema,
  updateNotificationSchema,

  // Deletion request
  createDeletionRequestSchema,
  decideDeletionRequestSchema,

  // Refresh token
  refreshTokenSchema
};
