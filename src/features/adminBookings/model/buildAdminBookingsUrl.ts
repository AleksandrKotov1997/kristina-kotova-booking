import type { AdminBookingFilters } from "./types";
export const buildAdminBookingsUrl = (filters: AdminBookingFilters) => {
  const parameters = new URLSearchParams();
  if (filters.status) parameters.set("status", filters.status);
  if (filters.date) parameters.set("date", filters.date);
  if (filters.search) parameters.set("search", filters.search);
  if (filters.page > 1) parameters.set("page", String(filters.page));
  const query = parameters.toString();
  return "/admin/bookings" + (query ? "?" + query : "");
};
