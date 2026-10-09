import type { z } from "zod";
import type {
  adminBookingSchema,
  adminBookingFiltersSchema,
  changeBookingStatusSchema,
} from "./schemas";
export type AdminBooking = z.infer<typeof adminBookingSchema>;
export type AdminBookingFilters = z.infer<typeof adminBookingFiltersSchema>;
export type ChangeBookingStatusInput = z.infer<
  typeof changeBookingStatusSchema
>;
