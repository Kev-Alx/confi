import * as z from "zod";

export const VerifyIdentitySchema = z.object({
  namaKtp: z.string().min(1, {
    message: "Full name is required",
  }),
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  address: z.string().min(1, {
    message: "Address is required",
  }),
  ktpPhoto: z.string().min(1, {
    message: "Endi mas KTP e? Jok nipu weh",
  }),
});

export type VerifyIdentitySchemaType = z.infer<typeof VerifyIdentitySchema>;
