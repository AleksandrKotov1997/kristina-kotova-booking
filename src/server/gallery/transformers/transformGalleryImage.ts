import type { GalleryImage } from "@/features/gallery/model/types";
import type { PublicLocale } from "@/shared/i18n/locales";
import type { GalleryImageRecord } from "../galleryImageRecordSchema";
export const transformGalleryImage = (
  record: GalleryImageRecord,
  locale: PublicLocale = "ru",
): GalleryImage => {
  const title = locale === "kk" ? record.title_kk : record.title;
  if (!title) throw new Error("Missing gallery translation: " + record.id);
  return {
    id: record.id,
    title,
    imageUrl: record.image_url,
    category: record.category,
    isActive: record.is_active,
    sortOrder: record.sort_order,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};
