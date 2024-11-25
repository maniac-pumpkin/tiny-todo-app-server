import nodemailer from "nodemailer";
import env from "../env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 587,
  service: "yahoo",
  secure: false,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendMail = async ({ client, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Tiny Todo App" <${env.EMAIL_USERNAME}>`,
      to: client,
      subject,
      text,
    });
  } catch (err) {
    console.error(err);
  }
};
