import "server-only";
import type { AuthContext } from "@/server/auth/createAuthContext";
import {
  adminBookingSchema,
  adminBookingListSchema,
  adminDashboardSchema,
} from "@/features/adminBookings/model/schemas";
import type {
  AdminBookingFilters,
  ChangeBookingStatusInput,
} from "@/features/adminBookings/model/types";

export const getAdminBookings = async (
  context: AuthContext,
  filters: AdminBookingFilters,
) => {
  const result = await context.client.rpc("get_admin_bookings", {
    selected_page: filters.page,
    selected_status: filters.status ?? null,
    selected_date: filters.date ?? null,
    search_text: filters.search,
  });
  if (result.error) throw result.error;
  return adminBookingListSchema.parse(result.data);
};
export const getAdminDashboard = async (context: AuthContext) => {
  const result = await context.client.rpc("get_admin_dashboard");
  if (result.error) throw result.error;
  return adminDashboardSchema.parse(result.data);
};
export const changeBookingStatus = async (
  context: AuthContext,
  id: string,
  input: ChangeBookingStatusInput,
) => {
  const result = await context.client.rpc("change_booking_status", {
    selected_booking_id: id,
    expected_status: input.expectedStatus,
    next_status: input.status,
  });
  if (result.error) throw result.error;
  return adminBookingSchema.parse(result.data);
};
