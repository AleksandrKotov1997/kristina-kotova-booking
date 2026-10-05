import "server-only";

import { z } from "zod";
import type { GalleryQuery } from "@/features/gallery/model/types";
import { createSupabaseRestClient } from "@/shared/supabase/createSupabaseRestClient";
import { galleryImageRecordSchema } from "../galleryImageRecordSchema";
import { transformGalleryImage } from "../transformers/transformGalleryImage";

export const getActiveGalleryImages = async ({
  category,
  limit = 24,
}: GalleryQuery) => {
  const response = await createSupabaseRestClient().get<unknown>(
    "/gallery_images",
    {
      params: {
        select:
          "id,title,image_url,category,is_active,sort_order,created_at,updated_at",
        is_active: "eq.true",
        category: category ? "eq." + category : undefined,
        order: "sort_order.asc,id.asc",
        limit,
      },
    },
  );

  return z
    .array(galleryImageRecordSchema)
    .parse(response.data)
    .map(transformGalleryImage);
};
