const nodemailer = require('nodemailer');

// Sends a plain-text email through SMTP (nodemailer is already a project dependency).
// If SMTP is not configured outside production, the message is logged to the console instead.
const sendEmail = async ({ to, subject, text }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP is not configured');
    }
    console.log(`[DEV EMAIL] to=${to} subject="${subject}"\n${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
