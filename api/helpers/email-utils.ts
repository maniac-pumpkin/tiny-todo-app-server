import nodemailer from "nodemailer";
import { verifyToken } from "../db/schema";
import db from "../db";
import env from "../env";

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

export const sendMail = async (
  client: string,
  subject: string,
  text: string
) => {
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

export const sendVerificationMail = async (userId: number, client: string) => {
  const generatedToken = crypto.randomUUID();

  await db.insert(verifyToken).values({
    userId: userId,
    token: generatedToken,
  });
  await sendMail(
    client,
    "Email verification",
    `${env.SERVER_URL}:${env.SERVER_PORT}/users/${userId}/${generatedToken}`
  );
};
