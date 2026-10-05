import { z } from "zod";
import { serviceSchema } from "@/features/services/model/schemas";

export const serviceRecordSchema = serviceSchema
  .pick({
    id: true,
    category: true,
    name: true,
    description: true,
    price: true,
  })
  .extend({
    duration_minutes: serviceSchema.shape.durationMinutes,
    is_active: serviceSchema.shape.isActive,
    sort_order: serviceSchema.shape.sortOrder,
    created_at: serviceSchema.shape.createdAt,
    updated_at: serviceSchema.shape.updatedAt,
  });

export type ServiceRecord = z.infer<typeof serviceRecordSchema>;
