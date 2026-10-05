import { apiClient } from "@/shared/api/apiClient";
import { galleryResponseSchema } from "../model/schemas";
import type { GalleryQuery } from "../model/types";

export const getGalleryImages = async (
  query: GalleryQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient.get<unknown>("/gallery", {
    params: query,
    signal,
  });

  return galleryResponseSchema.parse(response.data).data;
};
