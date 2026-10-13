import type { Service } from "@/features/services/model/types";
import type { PublicLocale } from "@/shared/i18n/locales";
import type { ServiceRecord } from "../serviceRecordSchema";
export const transformService = (
  record: ServiceRecord,
  locale: PublicLocale = "ru",
): Service => {
  const name = locale === "kk" ? record.name_kk : record.name;
  const description =
    locale === "kk" ? record.description_kk : record.description;
  if (!name || !description)
    throw new Error("Missing service translation: " + record.id);
  return {
    id: record.id,
    category: record.category,
    name,
    description,
    price: record.price,
    durationMinutes: record.duration_minutes,
    isActive: record.is_active,
    sortOrder: record.sort_order,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};
