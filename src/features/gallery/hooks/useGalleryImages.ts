import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getGalleryImages } from "../api/getGalleryImages";
import { galleryQueryKey } from "../model/constants";
import type { GalleryQuery } from "../model/types";

export const useGalleryImages = (query: GalleryQuery) => {
  const locale = useLocale();
  return useQuery({
    queryKey: [galleryQueryKey, query, locale],
    queryFn: ({ signal }) => getGalleryImages({ ...query, locale }, signal),
    staleTime: 60_000,
    retry: 1,
  });
};
