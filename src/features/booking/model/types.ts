import type { z } from "zod";
import type {
  bookingAvailabilitySchema,
  bookingCalendarSchema,
  bookingContactsSchema,
  bookingReceiptSchema,
  bookingSlotSchema,
  createBookingSchema,
} from "./schemas";
export type BookingContactsInput = z.input<typeof bookingContactsSchema>;
export type BookingContacts = z.output<typeof bookingContactsSchema>;
export type CreateBookingInput = z.output<typeof createBookingSchema>;
export type BookingCalendar = z.infer<typeof bookingCalendarSchema>;
export type BookingAvailability = z.infer<typeof bookingAvailabilitySchema>;
export type BookingSlot = z.infer<typeof bookingSlotSchema>;
export type BookingReceipt = z.infer<typeof bookingReceiptSchema>;
