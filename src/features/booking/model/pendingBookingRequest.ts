import { z } from "zod";

const storageKey = "booking.pendingRequestId";
const requestIdSchema = z.uuidv4();

export const readPendingBookingRequest = () => {
  const value = sessionStorage.getItem(storageKey);
  if (value === null) return null;
  const result = requestIdSchema.safeParse(value);
  if (result.success) return result.data;
  sessionStorage.removeItem(storageKey);
  return null;
};

export const savePendingBookingRequest = (requestId: string) => {
  sessionStorage.setItem(storageKey, requestIdSchema.parse(requestId));
};

export const clearPendingBookingRequest = () => {
  sessionStorage.removeItem(storageKey);
};
