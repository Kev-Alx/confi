"use server";

import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import { AddProofSchema, AddProofSchemaType } from "@/schemas/request";

export const addProof = async (input: AddProofSchemaType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const data = AddProofSchema.parse(input);

  try {
    const proof = await db.proof.findFirst({
      where: {
        id: data.id,
      },
    });
    console.log(proof);
    if (proof) {
      await db.proof.update({
        where: {
          id: proof?.id || "",
        },
        data: {
          inLocationPhoto: data.inLocationPhoto,
          invoicePhoto: data.invoicePhoto,
        },
      });
    } else {
      await db.proof.create({
        data: {
          itemId: data.itemId || "",
          inLocationPhoto: data.inLocationPhoto,
          invoicePhoto: data.invoicePhoto,
          requestId: data.requestId,
        },
      });
    }
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};
