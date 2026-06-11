import { apiClient } from "@/shared/api/apiClient";
import type { CurrentUser } from "../model/types";

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await apiClient.get<CurrentUser>("/me");
  return response.data;
};
