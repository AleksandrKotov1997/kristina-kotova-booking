import { apiClient } from "@/shared/api/apiClient";
import { workingHoursResponseSchema } from "../model/schemas";

export const getWorkingHours = async (signal?: AbortSignal) => {
  const response = await apiClient.get<unknown>("/working-hours", { signal });
  return workingHoursResponseSchema.parse(response.data).data;
};
