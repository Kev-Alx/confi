import { v4 as uuidv4 } from "uuid";

import { getverificationTokenByEmail } from "@/data/verification-token";

import { db } from "./db";

export const generateverificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 600 * 1000);
  const existingToken = await getverificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};
