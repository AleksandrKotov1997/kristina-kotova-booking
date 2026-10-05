import type { Service } from "@/features/services/model/types";
import type { ServiceRecord } from "../serviceRecordSchema";

export const transformService = (record: ServiceRecord): Service => ({
  id: record.id,
  category: record.category,
  name: record.name,
  description: record.description,
  price: record.price,
  durationMinutes: record.duration_minutes,
  isActive: record.is_active,
  sortOrder: record.sort_order,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});
