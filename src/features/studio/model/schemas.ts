import { z } from "zod";

const textSchema = z.string().trim().min(1);
const phoneSchema = z.string().regex(/^\+[1-9]\d{7,14}$/);

export const studioContactsSchema = z.object({
  phone: z
    .object({
      internationalNumber: phoneSchema,
      displayNumber: textSchema,
    })
    .nullable(),
  whatsappNumber: phoneSchema.nullable(),
  telegramUsername: z
    .string()
    .regex(/^[A-Za-z0-9_]+$/)
    .nullable(),
  instagramUsername: z
    .string()
    .regex(/^[A-Za-z0-9_.]+$/)
    .nullable(),
  location: z
    .object({
      city: textSchema,
      address: textSchema,
      directions: z.array(textSchema),
    })
    .nullable(),
});
