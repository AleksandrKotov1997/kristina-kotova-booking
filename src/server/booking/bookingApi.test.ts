import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as createBookingRequest } from "@/app/api/bookings/route";
import { POST as recoverBookingRequest } from "@/app/api/bookings/recovery/route";
import { createBooking, resolveBookingRequest } from "./bookingRepository";
vi.mock("server-only", () => ({}));
vi.mock("./bookingRepository");
const input = {
  serviceId: "f9000000-0000-4000-8000-000000000001",
  requestId: "f9000000-0000-4000-8000-000000000002",
  date: "2026-10-13",
  startTime: "10:00",
  clientName: "Тест",
  clientPhone: "+77000000001",
};
const request = (body: unknown, origin = "http://localhost:3001") =>
  new NextRequest("http://0.0.0.0:3000/api/bookings", {
    method: "POST",
    headers: {
      Host: "localhost:3001",
      Origin: origin,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(resolveBookingRequest).mockResolvedValue(null);
});
describe("booking HTTP boundary", () => {
  it("accepts the public Docker address", async () => {
    const response = await createBookingRequest(request(input));
    expect(response.status).toBe(201);
    expect(createBooking).toHaveBeenCalledWith(input);
  });
  it.each(["", "http://localhost:3000", "https://other.example", "null"])(
    "rejects an invalid origin %s before accessing data",
    async (origin) => {
      expect((await createBookingRequest(request(input, origin))).status).toBe(
        403,
      );
      expect(createBooking).not.toHaveBeenCalled();
    },
  );
  it("accepts a recovery with the same public Docker address", async () => {
    const response = await recoverBookingRequest(
      request({ requestId: input.requestId }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: null });
    expect(resolveBookingRequest).toHaveBeenCalledWith(input.requestId);
  });
  it("rejects extra recovery parameters", async () => {
    expect(
      (
        await recoverBookingRequest(
          request({
            requestId: input.requestId,
            clientPhone: input.clientPhone,
          }),
        )
      ).status,
    ).toBe(400);
    expect(resolveBookingRequest).not.toHaveBeenCalled();
  });
});
