import { z } from "zod";

export const galleryCategorySchema = z.enum(["lashes", "brows"]);

export const galleryImageSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(160),
  imageUrl: z.url({ protocol: /^https$/ }).max(2048),
  category: galleryCategorySchema,
  isActive: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const galleryQuerySchema = z.strictObject({
  category: galleryCategorySchema.optional(),
  limit: z
    .string()
    .regex(/^[0-9]+$/)
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional(),
});

export const galleryResponseSchema = z.object({
  data: z.array(galleryImageSchema),
});
