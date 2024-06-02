import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function getOTPOptions(recieverMail, otp) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: recieverMail,
    subject: "Reset Password OTP Socio",
    text: `Your reset password OTP for Socio is ${otp}`,
  };

  return mailOptions;
}
export function getRegistrationOptions(recieverMail, otp) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: recieverMail,
    subject: "Registration OTP Socio",
    text: `Your registration otp for Socio is ${otp}`,
  };

  return mailOptions;
}

export default transporter;

