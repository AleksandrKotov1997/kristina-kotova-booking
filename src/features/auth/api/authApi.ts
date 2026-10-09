import { isAxiosError } from "axios";
import { z } from "zod";
import { apiClient } from "@/shared/api/apiClient";
import { authErrorSchema, masterResponseSchema } from "../model/schemas";
import type { LoginCredentials } from "../model/types";

export const signIn = async (credentials: LoginCredentials) => {
  const response = await apiClient.post<unknown>("/auth/login", credentials, {
    timeout: 20_000,
  });
  return masterResponseSchema.parse(response.data).data;
};
export const signOut = async () => {
  const response = await apiClient.post<unknown>(
    "/auth/logout",
    {},
    { timeout: 20_000 },
  );
  z.strictObject({ success: z.literal(true) }).parse(response.data);
};
export const getAuthErrorMessage = (error: unknown) => {
  if (isAxiosError<unknown>(error)) {
    const result = authErrorSchema.safeParse(error.response?.data);
    if (result.success) return result.data.error.message;
  }
  return "Не удалось выполнить запрос. Проверьте соединение и попробуйте снова.";
};
