import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth/masterAccess");
vi.mock("./adminBookingRepository");
import { getVerifiedMaster } from "@/server/auth/masterAccess";
import {
  getAdminBookings,
  getAdminDashboard,
  changeBookingStatus,
} from "./adminBookingRepository";
import { GET as list } from "@/app/api/admin/bookings/route";
import { GET as dashboard } from "@/app/api/admin/dashboard/route";
import { PATCH } from "@/app/api/admin/bookings/[id]/status/route";

const id = "fa000000-0000-4000-8000-000000000010";
const params = { params: Promise.resolve({ id }) };
const patchRequest = (body: unknown, origin = "http://localhost:3000") =>
  new NextRequest(
    "http://localhost:3000/api/admin/bookings/" + id + "/status",
    {
      method: "PATCH",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://auth.example.com");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_unit_test");
  vi.clearAllMocks();
  vi.mocked(getVerifiedMaster).mockResolvedValue({
    id,
    email: "owner@example.com",
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin API boundary", () => {
  it("rejects guests before querying client data", async () => {
    vi.mocked(getVerifiedMaster).mockResolvedValue(null);
    expect(
      (await list(new NextRequest("http://localhost:3000/api/admin/bookings")))
        .status,
    ).toBe(401);
    expect(
      (
        await dashboard(
          new NextRequest("http://localhost:3000/api/admin/dashboard"),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await PATCH(
          patchRequest({ expectedStatus: "pending", status: "confirmed" }),
          params,
        )
      ).status,
    ).toBe(401);
    expect(getAdminBookings).not.toHaveBeenCalled();
    expect(getAdminDashboard).not.toHaveBeenCalled();
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });
  it("fails closed when Auth cannot verify the master", async () => {
    vi.mocked(getVerifiedMaster).mockRejectedValue(
      new Error("Private Auth detail"),
    );
    const response = await list(
      new NextRequest("http://localhost:3000/api/admin/bookings"),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("Private Auth detail");
    expect(getAdminBookings).not.toHaveBeenCalled();
  });
  it("normalizes filters and keeps private responses uncached", async () => {
    vi.mocked(getAdminBookings).mockResolvedValue({
      items: [],
      total: 0,
      page: 2,
      pageSize: 20,
      timeZone: "Asia/Almaty",
    });
    const response = await list(
      new NextRequest(
        "http://localhost:3000/api/admin/bookings?page=2&status=pending&search=%20Анна%20",
      ),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(getAdminBookings).toHaveBeenCalledWith(
      expect.objectContaining({ client: expect.anything() }),
      { page: 2, status: "pending", search: "Анна" },
    );
  });
  it.each([
    "?page=0",
    "?status=done",
    "?date=2026-02-30",
    "?page=1&page=2",
    "?unknown=true",
    "?__proto__=value",
  ])("rejects invalid list parameters %s", async (query) => {
    expect(
      (
        await list(
          new NextRequest("http://localhost:3000/api/admin/bookings" + query),
        )
      ).status,
    ).toBe(400);
    expect(getAdminBookings).not.toHaveBeenCalled();
  });
  it("blocks a cross-origin status change", async () => {
    expect(
      (
        await PATCH(
          patchRequest(
            { expectedStatus: "pending", status: "confirmed" },
            "https://other.example.com",
          ),
          params,
        )
      ).status,
    ).toBe(403);
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });
  it.each([
    { expectedStatus: "pending", status: "completed" },
    { expectedStatus: "completed", status: "pending" },
    { expectedStatus: "pending", status: "confirmed", clientName: "overwrite" },
  ])("rejects invalid transition payload %j", async (input) => {
    expect((await PATCH(patchRequest(input), params)).status).toBe(400);
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });
  it("rejects invalid booking ID", async () => {
    expect(
      (
        await PATCH(
          patchRequest({ expectedStatus: "pending", status: "confirmed" }),
          { params: Promise.resolve({ id: "bad" }) },
        )
      ).status,
    ).toBe(400);
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });
  it("forwards the expected status without trusting client details", async () => {
    await PATCH(
      patchRequest({ expectedStatus: "pending", status: "confirmed" }),
      params,
    );
    expect(changeBookingStatus).toHaveBeenCalledWith(expect.anything(), id, {
      expectedStatus: "pending",
      status: "confirmed",
    });
  });
  it.each([
    ["STATUS_CONFLICT", 409],
    ["BOOKING_NOT_FOUND", 404],
    ["ACCESS_DENIED", 403],
    ["INVALID_TRANSITION", 400],
    ["Private database failure", 503],
  ])("maps %s to a safe response", async (message, status) => {
    vi.mocked(changeBookingStatus).mockRejectedValue({
      message,
      details: "Private details",
    });
    const response = await PATCH(
      patchRequest({ expectedStatus: "pending", status: "confirmed" }),
      params,
    );
    expect(response.status).toBe(status);
    expect(await response.text()).not.toContain("Private");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
