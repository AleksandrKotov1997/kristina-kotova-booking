import { z } from "zod";
import { localeSchema } from "@/shared/i18n/locales";

export const serviceCategorySchema = z.enum(["lashes", "brows"]);

export const serviceSchema = z.object({
  id: z.uuid(),
  category: serviceCategorySchema,
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().nonnegative().finite(),
  durationMinutes: z.number().int().positive(),
  isActive: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const servicesQuerySchema = z.strictObject({
  locale: localeSchema.optional(),
  category: serviceCategorySchema.optional(),
});

export const servicesResponseSchema = z.object({
  data: z.array(serviceSchema),
});
