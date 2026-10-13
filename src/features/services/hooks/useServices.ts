import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/getServices";
import { servicesQueryKey } from "../model/constants";
import type { ServiceCategory } from "../model/types";

export const useServices = (category: ServiceCategory) => {
  const locale = useLocale();
  return useQuery({
    queryKey: [...servicesQueryKey, category, locale],
    queryFn: ({ signal }) => getServices({ category, locale }, signal),
    staleTime: 60_000,
    retry: 1,
  });
};
