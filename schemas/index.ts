import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 character required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 character required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
