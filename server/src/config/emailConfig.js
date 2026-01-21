const nodemailer = require("nodemailer");

const NODE_ENV = process.env.NODE_ENV || "development";
const HOST = process.env.SMTP_HOST || "smtp.gmail.com";

const config = {
  development: {
    host: HOST,
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  },
  production: {
    host: HOST,
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: true,
    },
  },
};

const emailConfig = config[NODE_ENV];

const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: USER,
    pass: PASS,
  },
  tls: emailConfig.tls,
});

const verifyConfiguration = async () => {
  try {
    await transporter.verify();
    // console.log(
    //   `SMTP configuration verified successfully (${NODE_ENV} environment)`
    // );
    return true;
  } catch (error) {
    console.error(`SMTP verification failed (${NODE_ENV} environment):`, error);
    return false;
  }
};

exports.sendEmail = async ({ from, to, subject, html, text }) => {
  try {
    await verifyConfiguration();
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw {
      statusCode: 500,
      message: "Failed to send email",
      details: error,
    };
  }
};

exports.emailConfig = emailConfig;
