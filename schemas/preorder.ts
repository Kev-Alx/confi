import { Category } from "@prisma/client";
import * as z from "zod";

import { RequestSchema } from "./request";

export const PreorderDetailsSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  location: z.string().min(1, {
    message: "Location is required",
  }),
  coverImage: z.string().min(1, {
    message: "Preorder must have a cover image",
  }),
  closeDate: z.date({
    required_error: "Close date is required",
  }),
  isRequestable: z.boolean().default(false),
});

export type PreorderDetailsSchemaType = z.infer<typeof PreorderDetailsSchema>;

export const PreorderDetailsSchemaItem = z.object({
  name: z.string().min(1, {
    message: "Item name is required",
  }),
  description: z.string(),
  link: z.string().optional(),
  category: z.nativeEnum(Category),
  price: z.coerce.number().min(1, {
    message: "Price cannot be negative or zero",
  }),
  amount: z.coerce
    .number()
    .min(1, {
      message: "You need to request at least 1 item",
    })
    .default(1),
  tips: z.coerce.number().min(1, {
    message: "Fee cannot be negative or zero",
  }),
  photos: z.object({ url: z.string() }).array().min(1, {
    message: "Must at least have 1 image",
  }),
  notes: z.string().optional(),
});

export type PreorderDetailsSchemaItemType = z.infer<
  typeof PreorderDetailsSchemaItem
>;

export const PreorderSchemaComplete = z.object({
  details: PreorderDetailsSchema,
  items: z.array(PreorderDetailsSchemaItem),
});

export type PreorderSchemaCompleteType = z.infer<typeof PreorderSchemaComplete>;

export const joinPreorderSchema = z.object({
  amount: z.number().min(1),
  itemId: z.string(),
});

export type JoinPreorderSchemaType = z.infer<typeof joinPreorderSchema>;

export const addItemPreorderSchema = z.object({
  ...RequestSchema.shape,
  preorderId: z.string(),
});
export type AddItemPreorderSchemaType = z.infer<typeof addItemPreorderSchema>;
