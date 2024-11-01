import * as z from "zod";

export const createNegotiationSchema = () =>
  z.object({
    negotiatedPrice: z.coerce.number().min(1, {
      message: "Fee cannot be negative or zero",
    }),
    closeDate: z.date({
      required_error: "Close date is required",
    }),
    notes: z.string().optional(),
  });
export const NegotiationCreateSchema = z.object({
  negotiatedPrice: z.coerce.number().min(1, {
    message: "Fee cannot be negative or zero",
  }),
  closeDate: z.date({
    required_error: "Close date is required",
  }),
  notes: z.string().optional(),
  buyerId: z.string(),
  requestId: z.string(),
});

export type NegotiationCreateSchemaType = z.infer<
  typeof NegotiationCreateSchema
>;
