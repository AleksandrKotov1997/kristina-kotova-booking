// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, AxiosHeaders } from "axios";
import { createElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServices } from "@/features/services/api/getServices";
import { serviceSchema } from "@/features/services/model/schemas";
import {
  createBooking,
  getBookingAvailability,
  getBookingCalendar,
} from "../api/bookingApi";
import {
  bookingAvailabilitySchema,
  bookingCalendarSchema,
  bookingReceiptSchema,
} from "../model/schemas";
import { bookingQueryKey } from "./useBookingQueries";
import { useBookingFlow } from "./useBookingFlow";
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock("@/features/services/api/getServices");
vi.mock("../api/bookingApi");
const service = serviceSchema.parse({
  id: "f9000000-0000-4000-8000-000000000001",
  category: "lashes",
  name: "Тестовая услуга",
  description: "Fixture",
  price: 2800,
  durationMinutes: 120,
  isActive: true,
  sortOrder: 0,
  createdAt: "2026-10-09T00:00:00Z",
  updatedAt: "2026-10-09T00:00:00Z",
});
const calendar = bookingCalendarSchema.parse({
  timeZone: "Asia/Almaty",
  today: "2026-10-09",
  lastDate: "2027-01-06",
  workingHours: [],
});
const available = bookingAvailabilitySchema.parse({
  date: "2026-10-10",
  timeZone: "Asia/Almaty",
  slots: [{ startTime: "10:00", endTime: "12:00", isAvailable: true }],
});
const receipt = bookingReceiptSchema.parse({
  id: "f9000000-0000-4000-8000-000000000003",
  status: "pending",
  date: "2026-10-10",
  startTime: "10:00",
  endTime: "12:00",
  serviceName: service.name,
  servicePrice: 2800,
  durationMinutes: 120,
});
const contacts = { clientName: "Тест", clientPhone: "+77000000001" };
const setupFlow = async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
  const hook = renderHook(
    () => useBookingFlow({ status: "requested", serviceId: service.id }),
    { wrapper },
  );
  await waitFor(() =>
    expect(hook.result.current.selectedService?.id).toBe(service.id),
  );
  act(() => hook.result.current.selectDate("2026-10-10"));
  await waitFor(() =>
    expect(hook.result.current.availability.isSuccess).toBe(true),
  );
  const slot = available.slots[0];
  if (!slot) throw new Error("Missing fixture slot");
  act(() => hook.result.current.selectSlot(slot));
  return { ...hook, client };
};
beforeEach(() => {
  vi.mocked(getServices).mockResolvedValue([service]);
  vi.mocked(getBookingCalendar).mockResolvedValue(calendar);
  vi.mocked(getBookingAvailability).mockResolvedValue(available);
  vi.mocked(createBooking).mockReset();
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe("booking submission recovery", () => {
  it("retries the same request when the first response is lost and the slot becomes occupied", async () => {
    vi.mocked(createBooking)
      .mockRejectedValueOnce(new Error("Connection lost"))
      .mockResolvedValueOnce(receipt);
    const hook = await setupFlow();
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() =>
      expect(hook.result.current.canRetrySubmission).toBe(true),
    );
    vi.mocked(getBookingAvailability).mockResolvedValue({
      ...available,
      slots: available.slots.map((slot) => ({ ...slot, isAvailable: false })),
    });
    await act(async () => {
      await hook.client.invalidateQueries({ queryKey: bookingQueryKey });
    });
    await waitFor(() =>
      expect(hook.result.current.isSlotAvailable).toBe(false),
    );
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() => expect(hook.result.current.receipt).toEqual(receipt));
    const calls = vi.mocked(createBooking).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[1]?.[0].requestId).toBe(calls[0]?.[0].requestId);
    hook.client.clear();
  });
  it("refreshes availability after a conflict and requires another slot", async () => {
    vi.mocked(createBooking).mockRejectedValueOnce(
      new AxiosError("Conflict", "ERR_BAD_REQUEST", undefined, undefined, {
        status: 409,
        statusText: "Conflict",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { error: { code: "SLOT_UNAVAILABLE", message: "Unavailable" } },
      }),
    );
    const hook = await setupFlow();
    vi.mocked(getBookingAvailability).mockResolvedValue({
      ...available,
      slots: available.slots.map((slot) => ({ ...slot, isAvailable: false })),
    });
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() => expect(hook.result.current.booking.isError).toBe(true));
    await waitFor(() =>
      expect(hook.result.current.isSlotAvailable).toBe(false),
    );
    expect(hook.result.current.canRetrySubmission).toBe(false);
    act(() => hook.result.current.submitContacts(contacts));
    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(hook.result.current.receipt).toBeNull();
    hook.client.clear();
  });
  it("clears the selected time when the date changes", async () => {
    const hook = await setupFlow();
    expect(hook.result.current.isSlotAvailable).toBe(true);
    act(() => hook.result.current.selectDate("2026-10-11"));
    expect(hook.result.current.slot).toBeNull();
    expect(hook.result.current.isSlotAvailable).toBe(false);
    act(() => hook.result.current.submitContacts(contacts));
    expect(createBooking).not.toHaveBeenCalled();
    hook.client.clear();
  });
});
