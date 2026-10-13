import { z } from "zod";
import { getBookingError } from "../api/bookingError";
const publicBookingErrorCodeSchema = z.enum([
  "SLOT_UNAVAILABLE",
  "SERVICE_UNAVAILABLE",
  "INVALID_DATE",
  "INVALID_BOOKING",
  "REQUEST_REUSED",
  "REQUEST_CLOSED",
  "UNAVAILABLE",
  "INVALID_REQUEST",
  "INVALID_ORIGIN",
  "PAYLOAD_TOO_LARGE",
  "INVALID_CONTENT_TYPE",
  "INVALID_BODY",
]);
export const getPublicBookingErrorCode = (error: unknown) => {
  const result = publicBookingErrorCodeSchema.safeParse(
    getBookingError(error).code,
  );
  return result.success ? result.data : "UNAVAILABLE";
};
