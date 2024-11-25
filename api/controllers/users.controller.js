import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import {
  insertNewUser,
  insertNewVerifyToken,
  getUserByEmail,
  getVerifyToken,
  updateIsVerified,
  deleteVerifyToken,
} from "../helpers/sql-utils.js";
import { sendMail } from "../helpers/email-utils.js";
import env from "../env.js";

const sendVerificationEmail = async (user) => {
  const generatedToken = crypto.randomUUID();
  await insertNewVerifyToken({ userId: user.id, token: generatedToken });
  await sendMail({
    client: user.email,
    subject: "Your verification link",
    text: `${env.SERVER_URL}:${env.SERVER_PORT}/users/${user.id}/${generatedToken}`,
  });
};

export async function registerUser(req, res, next) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const newUser = await insertNewUser({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
    });
    await sendVerificationEmail(newUser);

    res.status(201).send("Registration successful. Please check your email.");
  } catch (error) {
    next(error);
  }
}

export async function signInUser(req, res, next) {
  try {
    const specificUser = await getUserByEmail(req.body.email);

    if (
      !specificUser ||
      !bcrypt.compareSync(req.body.password, specificUser.password)
    )
      return res.status(401).send("Incorrect password or email.");

    if (!specificUser.is_verified) {
      await sendVerificationEmail(specificUser);
      res
        .status(403)
        .send(
          "You must verify your email before signing in. A verification link has been sent to your email."
        );
    }

    const jwtToken = jwt.sign(
      { userId: specificUser.id },
      env.JWT_SECRET_TOKEN,
      { expiresIn: "24h" }
    );

    res.status(200).send(jwtToken);
  } catch (error) {
    next(error);
  }
}

export async function verifyUserEmail(req, res, next) {
  const verifyTokenSchema = z.object({
    user_id: z.number(),
    token: z.string(),
    exp_date: z.date(),
  });

  try {
    const { userId, token } = req.params;

    const verifyToken = await verifyTokenSchema.parseAsync(
      await getVerifyToken({ userId, token })
    );

    if (!verifyToken) return res.status(400).send("Invalid token.");

    await updateIsVerified(userId);
    await deleteVerifyToken({ userId, token });

    res.status(200).send("Successfully verified your email.");
  } catch (error) {
    next(error);
  }
}
