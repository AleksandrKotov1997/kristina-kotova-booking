import type { GalleryImage } from "@/features/gallery/model/types";
import type { GalleryImageRecord } from "../galleryImageRecordSchema";

export const transformGalleryImage = (
  record: GalleryImageRecord,
): GalleryImage => ({
  id: record.id,
  title: record.title,
  imageUrl: record.image_url,
  category: record.category,
  isActive: record.is_active,
  sortOrder: record.sort_order,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});
