import { describe, expect, it } from "vitest";
import {
  bookingContactsSchema,
  createBookingSchema,
  bookingAvailabilityQuerySchema,
} from "./schemas";
const validBooking = {
  serviceId: "f9000000-0000-4000-8000-000000000001",
  requestId: "f9000000-0000-4000-8000-000000000002",
  date: "2026-10-10",
  startTime: "10:00",
  clientName: "Анна",
  clientPhone: "+7 (701) 123-45-67",
};
describe("booking validation", () => {
  it("trims the name and normalizes an international phone", () => {
    expect(
      bookingContactsSchema.parse({
        clientName: "  Анна-Мария  ",
        clientPhone: validBooking.clientPhone,
      }),
    ).toEqual({ clientName: "Анна-Мария", clientPhone: "+77011234567" });
  });
  it("accepts international names and an apostrophe", () => {
    expect(
      bookingContactsSchema.safeParse({
        clientName: "Zoë O'Neil",
        clientPhone: "+441234567890",
      }).success,
    ).toBe(true);
  });
  it.each(
    ["", "А", "Анна123", "<script>", "Анна\nИванова", "А".repeat(101)].map(
      (clientName) => ({ clientName }),
    ),
  )("rejects invalid name $clientName", ({ clientName }) =>
    expect(
      createBookingSchema.safeParse({ ...validBooking, clientName }).success,
    ).toBe(false),
  );
  it.each(
    [
      "",
      "123",
      "77011234567",
      "+07011234567",
      "+7abc01234567",
      "+1234567890123456",
    ].map((clientPhone) => ({ clientPhone })),
  )("rejects invalid phone $clientPhone", ({ clientPhone }) =>
    expect(
      createBookingSchema.safeParse({ ...validBooking, clientPhone }).success,
    ).toBe(false),
  );
  it.each(
    ["2026-02-30", "2026-13-10", "10.10.2026", "2026-10-10T10:00:00Z"].map(
      (date) => ({ date }),
    ),
  )("rejects invalid date $date", ({ date }) =>
    expect(
      createBookingSchema.safeParse({ ...validBooking, date }).success,
    ).toBe(false),
  );
  it.each(
    ["24:00", "10:60", "10:00:01", "ten"].map((startTime) => ({ startTime })),
  )("rejects invalid time $startTime", ({ startTime }) =>
    expect(
      createBookingSchema.safeParse({ ...validBooking, startTime }).success,
    ).toBe(false),
  );
  it("rejects client-provided end time, price and status", () => {
    expect(
      createBookingSchema.safeParse({
        ...validBooking,
        endTime: "12:00",
        price: 0,
        status: "confirmed",
      }).success,
    ).toBe(false);
  });
  it("requires a valid idempotency key", () => {
    expect(
      createBookingSchema.safeParse({ ...validBooking, requestId: "invalid" })
        .success,
    ).toBe(false);
  });
  it("rejects unknown availability parameters", () => {
    expect(
      bookingAvailabilityQuerySchema.safeParse({
        serviceId: validBooking.serviceId,
        date: validBooking.date,
        includeClients: true,
      }).success,
    ).toBe(false);
  });
});
