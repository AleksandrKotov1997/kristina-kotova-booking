import { apiClient } from "@/shared/api/apiClient";
import { servicesResponseSchema } from "../model/schemas";
import type { ServicesQuery } from "../model/types";

export const getServices = async (
  query: ServicesQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient.get<unknown>("/services", {
    params: query,
    signal,
  });

  return servicesResponseSchema.parse(response.data).data;
};
