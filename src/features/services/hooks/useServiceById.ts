import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../api/getServiceById";
import { servicesQueryKey } from "../model/constants";

export const useServiceById = (serviceId: string | null) =>
  useQuery({
    queryKey: [...servicesQueryKey, "by-id", serviceId],
    queryFn: ({ signal }) =>
      serviceId === null ? null : getServiceById(serviceId, signal),
    enabled: serviceId !== null,
    staleTime: 0,
    refetchOnMount: "always",
    retry: 1,
  });
