import { z } from "zod";

export const loginSchema = z.strictObject({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email("Введите корректный email.")),
  password: z
    .string()
    .min(1, "Введите пароль.")
    .max(1024, "Пароль слишком длинный."),
});

export const masterProfileSchema = z.strictObject({
  id: z.uuid(),
  email: z.email(),
});
export const masterResponseSchema = z.strictObject({
  data: masterProfileSchema,
});
export const authErrorSchema = z.object({
  error: z.object({ message: z.string() }),
});
