const { sendEmail } = require("../config/emailConfig");
const { generateVerificationEmail } = require("../utils/emailTemplates");

const emailService = {
  async sendResetEmail(email, name, token) {
    const url = `${
      process.env.FRONTEND_URL
    }/reset-password?token=${encodeURIComponent(token)}`;
    const { html, text } = generateVerificationEmail(
      url,
      name,
      "Reset Password Request",
      "We've received your reset password request. Please click the link below to reset your account:",
      true,
      "Reset Password",
    );

    await sendEmail({
      from: `Reset Password <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html,
      text,
    });
  },
};

module.exports = emailService;
