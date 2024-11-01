"use server";

import { Negotiation } from "@prisma/client";

import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import {
  NegotiationCreateSchema,
  NegotiationCreateSchemaType,
} from "@/schemas/negotiations";

export const createNegotiation = async (input: NegotiationCreateSchemaType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const data = NegotiationCreateSchema.parse(input);

  if (data.buyerId === user.id)
    throw new Error("Can't negotiate with yourself!");

  try {
    const nego = await db.negotiation.create({
      data: {
        negotiatedPrice: data.negotiatedPrice,
        closeDate: data.closeDate,
        notes: data.notes || "",
        jastiperId: user.id || "",
        requestId: data.requestId,
      },
    });

    return { status: 200, id: nego.id };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const cancelNegotiation = async (input: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const negotiation = await db.negotiation.findFirst({
      where: {
        id: input,
        jastiperId: user.id,
      },
    });

    if (!negotiation) {
      throw new Error("Unauthorized");
    }

    await db.negotiation.delete({
      where: {
        id: input,
      },
    });

    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const rejectNegotiation = async (input: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.negotiation.delete({
      where: {
        id: input,
      },
    });

    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const acceptNegotiaion = async (nego: Negotiation) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.request.update({
      where: {
        id: nego.requestId,
      },
      data: {
        status: "ACCEPTED",
        item: {
          update: {
            tips: nego.negotiatedPrice,
          },
        },
      },
    });

    await db.request.update({
      where: {
        id: nego.requestId,
      },
      data: {
        jastiperId: nego.jastiperId,
      },
    });

    await db.negotiation.deleteMany({
      where: {
        requestId: nego.requestId,
      },
    });

    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};
