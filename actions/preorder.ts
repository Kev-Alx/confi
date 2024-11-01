"use server";

import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import {
  AddItemPreorderSchemaType,
  JoinPreorderSchemaType,
  PreorderSchemaComplete,
  PreorderSchemaCompleteType,
  addItemPreorderSchema,
  joinPreorderSchema,
} from "@/schemas/preorder";

export const createPreorder = async (input: PreorderSchemaCompleteType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const data = PreorderSchemaComplete.parse(input);

  try {
    const preorder = await db.preOrder.create({
      data: {
        title: data.details.title,
        description: data.details.description || "",
        location: data.details.location,
        coverImage: data.details.coverImage,
        closeDate: data.details.closeDate,
        isRequestable: data.details.isRequestable,
        jastiperId: user.id || "",
      },
    });

    await Promise.all(
      data.items.map(async (item) => {
        const createdItem = await db.item.create({
          data: {
            name: item.name,
            description: item.description || "",
            link: item.link,
            category: item.category,
            amount: item.amount,
            price: item.price,
            tips: item.tips,
            preOrderId: preorder.id,
          },
        });

        await Promise.all(
          item.photos.map(async (image) => {
            await db.media.create({
              data: {
                url: image.url,
                itemId: createdItem.id,
              },
            });
          })
        );
      })
    );
    return { status: 200, id: preorder.id };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const joinPreorder = async (input: JoinPreorderSchemaType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const data = joinPreorderSchema.parse(input);

  try {
    await db.preorderJoins.create({
      data: {
        amount: data.amount,
        itemId: data.itemId,
        userId: user.id || "",
      },
    });
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};

export const addItemPreorder = async (input: AddItemPreorderSchemaType) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const data = addItemPreorderSchema.parse(input);

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
        preOrderId: data.preorderId,
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
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 400, error: error };
  }
};
