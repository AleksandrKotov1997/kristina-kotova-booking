import { isAxiosError } from "axios";
import { apiClient } from "@/shared/api/apiClient";
import {
  adminBookingListResponseSchema,
  adminDashboardResponseSchema,
  adminBookingResponseSchema,
  adminErrorSchema,
} from "../model/schemas";
import type {
  AdminBookingFilters,
  ChangeBookingStatusInput,
} from "../model/types";

export const getAdminBookings = async (
  filters: AdminBookingFilters,
  signal: AbortSignal,
) => {
  const response = await apiClient.get<unknown>("/admin/bookings", {
    params: filters,
    signal,
    timeout: 20_000,
  });
  return adminBookingListResponseSchema.parse(response.data).data;
};
export const getAdminDashboard = async (signal: AbortSignal) => {
  const response = await apiClient.get<unknown>("/admin/dashboard", {
    signal,
    timeout: 20_000,
  });
  return adminDashboardResponseSchema.parse(response.data).data;
};
export const changeBookingStatus = async ({
  id,
  ...input
}: ChangeBookingStatusInput & { id: string }) => {
  const response = await apiClient.patch<unknown>(
    "/admin/bookings/" + id + "/status",
    input,
    { timeout: 20_000 },
  );
  return adminBookingResponseSchema.parse(response.data).data;
};
export const getAdminErrorMessage = (error: unknown) => {
  if (isAxiosError<unknown>(error)) {
    const parsed = adminErrorSchema.safeParse(error.response?.data);
    if (parsed.success) return parsed.data.error.message;
  }
  return "Не удалось выполнить запрос. Проверьте соединение и попробуйте снова.";
};
export const isAdminAccessError = (error: unknown) =>
  isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0);
