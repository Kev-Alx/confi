"use server";

import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import {
  VerifyIdentitySchema,
  VerifyIdentitySchemaType,
} from "@/schemas/jastiper";

export const verifyJastiper = async (input: VerifyIdentitySchemaType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const data = VerifyIdentitySchema.parse(input);

  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        namaKtp: data.namaKtp,
        dob: data.dob,
        address: data.address,
        ktpPhotoUrl: data.ktpPhoto,
        role: "JASTIPER",
      },
    });

    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};
