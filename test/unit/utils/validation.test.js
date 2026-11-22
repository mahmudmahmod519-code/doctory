// Unit tests — utils/validation.js
const validation = require('../../utils/validation');

describe('utils/validation', () => {
  it('exports the auth schemas', () => {
    expect(validation.registerPatientSchema).toBeDefined();
    expect(validation.registerDoctorSchema).toBeDefined();
    expect(validation.loginSchema).toBeDefined();
    expect(validation.forgotPasswordSchema).toBeDefined();
    expect(validation.resetPasswordSchema).toBeDefined();
    expect(validation.changePasswordSchema).toBeDefined();
    expect(validation.verifyEmailSchema).toBeDefined();
    expect(validation.verify2faSchema).toBeDefined();
  });

  it('exports the model schemas', () => {
    expect(validation.updateProfileSchema).toBeDefined();
    expect(validation.createDoctorPortfolioSchema).toBeDefined();
    expect(validation.updateDoctorPortfolioSchema).toBeDefined();
    expect(validation.createDoctorWorkSchema).toBeDefined();
    expect(validation.updateDoctorWorkSchema).toBeDefined();
    expect(validation.createBookingSchema).toBeDefined();
    expect(validation.updateBookingSchema).toBeDefined();
    expect(validation.createBookingItemSchema).toBeDefined();
    expect(validation.updateBookingItemSchema).toBeDefined();
    expect(validation.createReviewSchema).toBeDefined();
    expect(validation.createReportSchema).toBeDefined();
    expect(validation.createNotificationSchema).toBeDefined();
    expect(validation.createDeletionRequestSchema).toBeDefined();
    expect(validation.decideDeletionRequestSchema).toBeDefined();
  });

  it('exports the pagination and the param schemas', () => {
    expect(validation.paginationSchema).toBeDefined();
    expect(validation.objectIdParamSchema).toBeDefined();
    expect(validation.bookingItemIdParamSchema).toBeDefined();
    expect(validation.doctorIdParamSchema).toBeDefined();
  });

  describe('registerPatientSchema', () => {
    it('accepts a valid patient payload', () => {
      const { error } = validation.registerPatientSchema.validate({
        name: 'محمد علي',
        email: 'patient@doctory.test',
        password: 'Strong123!'
      });
      expect(error).toBeUndefined();
    });

    it('rejects a short password', () => {
      const { error } = validation.registerPatientSchema.validate({
        name: 'محمد علي',
        email: 'patient@doctory.test',
        password: '123'
      });
      expect(error).toBeDefined();
    });

    it('rejects an invalid email', () => {
      const { error } = validation.registerPatientSchema.validate({
        name: 'محمد علي',
        email: 'wrong-email',
        password: 'Strong123!'
      });
      expect(error).toBeDefined();
    });
  });

  describe('createBookingSchema', () => {
    it('requires the type, the date and the time', () => {
      const { error } = validation.createBookingSchema.validate({
        portfolio_id: '507f1f77bcf86cd799439011',
        type: 'booking',
        appointment_date: '2026-11-20',
        appointment_time: '16:00'
      });
      expect(error).toBeUndefined();
    });

    it('rejects an invalid appointment time format', () => {
      const { error } = validation.createBookingSchema.validate({
        portfolio_id: '507f1f77bcf86cd799439011',
        type: 'booking',
        appointment_date: '2026-11-20',
        appointment_time: '25:99'
      });
      expect(error).toBeDefined();
    });

    it('rejects an unknown type', () => {
      const { error } = validation.createBookingSchema.validate({
        portfolio_id: '507f1f77bcf86cd799439011',
        type: 'unknown',
        appointment_date: '2026-11-20',
        appointment_time: '16:00'
      });
      expect(error).toBeDefined();
    });
  });

  describe('paginationSchema', () => {
    it('applies the default page and limit', () => {
      const { value } = validation.paginationSchema.validate({});
      expect(value.page).toBe(1);
      expect(value.limit).toBe(20);
    });

    it('rejects a limit above the maximum', () => {
      const { error } = validation.paginationSchema.validate({ limit: 500 });
      expect(error).toBeDefined();
    });
  });
});
