import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/getServices";
import { servicesQueryKey } from "../model/constants";
import type { ServiceCategory } from "../model/types";

export const useServices = (category: ServiceCategory) => {
  return useQuery({
    queryKey: [...servicesQueryKey, category],
    queryFn: ({ signal }) => getServices({ category }, signal),
    staleTime: 60_000,
    retry: 1,
  });
};
