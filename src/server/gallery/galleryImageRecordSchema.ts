import { z } from "zod";
import { galleryImageSchema } from "@/features/gallery/model/schemas";

export const galleryImageRecordSchema = z.object({
  id: galleryImageSchema.shape.id,
  title: galleryImageSchema.shape.title,
  image_url: galleryImageSchema.shape.imageUrl,
  category: galleryImageSchema.shape.category,
  is_active: galleryImageSchema.shape.isActive,
  sort_order: galleryImageSchema.shape.sortOrder,
  created_at: galleryImageSchema.shape.createdAt,
  updated_at: galleryImageSchema.shape.updatedAt,
});

export type GalleryImageRecord = z.infer<typeof galleryImageRecordSchema>;
