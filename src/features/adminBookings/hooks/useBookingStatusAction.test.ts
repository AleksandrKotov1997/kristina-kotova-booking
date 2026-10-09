// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { changeBookingStatus } from "../api/adminBookingsApi";
import { adminBookingSchema } from "../model/schemas";
import { adminBookingsQueryKey } from "./useAdminBookings";
import { bookingQueryKey } from "@/features/booking/hooks/useBookingQueries";
import { useBookingStatusAction } from "./useBookingStatusAction";
vi.mock("../api/adminBookingsApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api/adminBookingsApi")>()),
  changeBookingStatus: vi.fn(),
}));
const booking = adminBookingSchema.parse({
  id: "fa000000-0000-4000-8000-000000000010",
  serviceId: "fa000000-0000-4000-8000-000000000003",
  serviceName: "Тестовая услуга",
  servicePrice: 2800,
  clientName: "Тест",
  clientPhone: "+77009999999",
  date: "2026-10-10",
  startTime: "10:00",
  endTime: "11:00",
  status: "pending",
  createdAt: "2026-10-09T00:00:00Z",
  updatedAt: "2026-10-09T00:00:00Z",
});
const setupAction = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  client.setQueryData([...adminBookingsQueryKey, "list"], [booking]);
  client.setQueryData([...adminBookingsQueryKey, "dashboard"], {});
  client.setQueryData([...bookingQueryKey, "availability"], {});
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
  return { ...renderHook(() => useBookingStatusAction(), { wrapper }), client };
};
beforeEach(() => {
  vi.mocked(changeBookingStatus).mockReset();
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe("status action lifecycle", () => {
  it("waits for confirmation and sends the selected snapshot status", async () => {
    vi.mocked(changeBookingStatus).mockResolvedValue({
      ...booking,
      status: "confirmed",
    });
    const hook = setupAction();
    act(() => hook.result.current.select(booking, "confirmed"));
    expect(changeBookingStatus).not.toHaveBeenCalled();
    hook.rerender();
    act(() => hook.result.current.submit());
    await waitFor(() =>
      expect(hook.result.current.mutation.isSuccess).toBe(true),
    );
    expect(vi.mocked(changeBookingStatus).mock.calls[0]?.[0]).toEqual({
      id: booking.id,
      expectedStatus: "pending",
      status: "confirmed",
    });
    expect(hook.result.current.selection).toBeNull();
    for (const key of [
      [...adminBookingsQueryKey, "list"],
      [...adminBookingsQueryKey, "dashboard"],
      [...bookingQueryKey, "availability"],
    ])
      expect(hook.client.getQueryState(key)?.isInvalidated).toBe(true);
  });
  it("preserves an error even when a refetch removes the row", async () => {
    vi.mocked(changeBookingStatus).mockRejectedValue(
      new Error("Status conflict"),
    );
    const hook = setupAction();
    act(() => hook.result.current.select(booking, "cancelled"));
    act(() => hook.result.current.submit());
    await waitFor(() =>
      expect(hook.result.current.mutation.isError).toBe(true),
    );
    hook.client.setQueryData([...adminBookingsQueryKey, "list"], []);
    hook.rerender();
    expect(hook.result.current.selection?.booking.status).toBe("pending");
    expect(hook.result.current.mutation.error?.message).toBe("Status conflict");
    expect(changeBookingStatus).toHaveBeenCalledTimes(1);
    act(() => hook.result.current.close());
    await waitFor(() => expect(hook.result.current.selection).toBeNull());
  });
  it("does not change the selection or close while a request is pending", async () => {
    let finish: ((value: typeof booking) => void) | undefined;
    vi.mocked(changeBookingStatus).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const hook = setupAction();
    act(() => hook.result.current.select(booking, "confirmed"));
    act(() => hook.result.current.submit());
    await waitFor(() =>
      expect(hook.result.current.mutation.isPending).toBe(true),
    );
    act(() => {
      hook.result.current.close();
      hook.result.current.select(booking, "cancelled");
      hook.result.current.submit();
    });
    expect(hook.result.current.selection?.status).toBe("confirmed");
    expect(changeBookingStatus).toHaveBeenCalledTimes(1);
    await act(async () => {
      finish?.({ ...booking, status: "confirmed" });
    });
  });
});
