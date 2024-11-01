import { Category } from "@prisma/client";
import * as z from "zod";

export const RequestSchema = z.object({
  name: z.string().min(1, {
    message: "Item name is required",
  }),
  description: z.string(),
  link: z.string().optional(),
  category: z.nativeEnum(Category),
  location: z.string().min(1, {
    message: "Country is required",
  }),
  itemPrice: z.coerce.number().min(1, {
    message: "Price cannot be negative or zero",
  }),
  amount: z.coerce
    .number()
    .min(1, {
      message: "You need to request at least 1 item",
    })
    .default(1),
  fee: z.coerce.number().min(1, {
    message: "Fee cannot be negative or zero",
  }),
  images: z.object({ url: z.string() }).array().min(1, {
    message: "Must at least have 1 image",
  }),
  notes: z.string().optional(),
});

export type RequestSchemaType = z.infer<typeof RequestSchema>;

export const AddProofSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  inLocationPhoto: z.string().optional(),
  invoicePhoto: z.string().optional(),
  legitCheckCertificate: z.string().optional(),
  preOrderId: z.string().optional(),
  requestId: z.string().optional(),
});

export type AddProofSchemaType = z.infer<typeof AddProofSchema>;
