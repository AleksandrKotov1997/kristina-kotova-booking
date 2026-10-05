import { useQuery } from "@tanstack/react-query";
import { getGalleryImages } from "../api/getGalleryImages";
import { galleryQueryKey } from "../model/constants";
import type { GalleryQuery } from "../model/types";

export const useGalleryImages = (query: GalleryQuery) =>
  useQuery({
    queryKey: [galleryQueryKey, query],
    queryFn: ({ signal }) => getGalleryImages(query, signal),
    staleTime: 60_000,
    retry: 1,
  });
