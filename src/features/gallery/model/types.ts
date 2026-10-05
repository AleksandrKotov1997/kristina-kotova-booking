import { z } from "zod";
import {
  galleryCategorySchema,
  galleryImageSchema,
  galleryQuerySchema,
} from "./schemas";

export type GalleryCategory = z.infer<typeof galleryCategorySchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type GalleryQuery = z.output<typeof galleryQuerySchema>;
