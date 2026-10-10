import { describe, expect, it } from "vitest";
import {
  bookingStatusSchema,
  canChangeBookingStatus,
} from "@/features/booking/model/bookingStatus";
import {
  adminBookingFiltersSchema,
  changeBookingStatusSchema,
} from "./schemas";
import { buildAdminBookingsUrl } from "./buildAdminBookingsUrl";
import { formatBookingDate } from "./formatBookingDate";
const validTransitions = [
  "pending:confirmed",
  "pending:cancelled",
  "confirmed:completed",
  "confirmed:cancelled",
];
describe("booking status transitions", () => {
  for (const current of bookingStatusSchema.options)
    for (const next of bookingStatusSchema.options) {
      it(current + " -> " + next, () => {
        const allowed = validTransitions.includes(current + ":" + next);
        expect(canChangeBookingStatus(current, next)).toBe(allowed);
        expect(
          changeBookingStatusSchema.safeParse({
            expectedStatus: current,
            status: next,
          }).success,
        ).toBe(allowed);
      });
    }
  it("rejects extra input fields", () =>
    expect(
      changeBookingStatusSchema.safeParse({
        expectedStatus: "pending",
        status: "confirmed",
        clientPhone: "changed",
      }).success,
    ).toBe(false));
});
describe("list filters", () => {
  it("normalizes defaults and query page", () =>
    expect(
      adminBookingFiltersSchema.parse({ page: "2", search: "  Анна  " }),
    ).toEqual({ page: 2, search: "Анна" }));
  it.each([
    { page: "" },
    { page: "0" },
    { page: "1.5" },
    { page: "1000001" },
    { page: ["1", "2"] },
    { status: "done" },
    { date: "2026-02-30" },
    { serviceId: "unexpected" },
    { search: "x".repeat(101) },
  ])("rejects invalid filters %j", (filters) =>
    expect(adminBookingFiltersSchema.safeParse(filters).success).toBe(false),
  );
  it("encodes search without creating another query parameter", () => {
    const url = new URL(
      buildAdminBookingsUrl({
        page: 2,
        status: "pending",
        date: "2026-10-09",
        search: "Анна & status=cancelled",
      }),
      "http://localhost",
    );
    expect(url.searchParams.getAll("status")).toEqual(["pending"]);
    expect(url.searchParams.get("search")).toBe("Анна & status=cancelled");
  });
  it("preserves the calendar day", () =>
    expect(formatBookingDate("2026-01-01")).toContain("1 янв. 2026"));
});
