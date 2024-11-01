"use server";

import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import { RequestSchema, RequestSchemaType } from "@/schemas/request";

export const createRequests = async (input: RequestSchemaType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const data = RequestSchema.parse(input);

  try {
    const item = await db.item.create({
      data: {
        name: data.name,
        description: data.description || "",
        link: data.link,
        category: data.category,
        amount: data.amount,
        price: data.itemPrice,
        tips: data.fee,
      },
    });
    await Promise.all(
      data.images.map(async (image) => {
        await db.media.create({
          data: {
            url: image.url,
            itemId: item.id,
          },
        });
      })
    );
    const request = await db.request.create({
      data: {
        location: data.location,
        itemId: item.id,
        buyerId: user.id || "",
      },
    });

    // console.log(item, request, user);

    return { status: 200, id: request.id };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const acceptRequests = async (input: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.request.update({
      where: {
        id: input,
      },
      data: {
        status: "ACCEPTED",
        jastiperId: user.id,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const deleteRequests = async (input: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const req = await db.request.findFirst({
      where: {
        id: input,
        buyerId: user.id,
      },
    });

    if (req?.status === "ACCEPTED") {
      return { status: 400, error: "Request already accepted" };
    }

    await db.request.delete({
      where: {
        id: input,
        buyerId: user.id,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};
