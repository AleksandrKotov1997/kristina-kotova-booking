// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, AxiosHeaders } from "axios";
import { useEffect, useState, type ReactNode } from "react";
import type { PublicLocale } from "@/shared/i18n/locales";
import kkMessages from "@/shared/i18n/messages/kk.json";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServices } from "@/features/services/api/getServices";
import { serviceSchema } from "@/features/services/model/schemas";
import {
  createBooking,
  getBookingAvailability,
  getBookingCalendar,
  resolveBookingRequest,
} from "../api/bookingApi";
import {
  bookingAvailabilitySchema,
  bookingCalendarSchema,
  bookingReceiptSchema,
} from "../model/schemas";
import { bookingQueryKey } from "./useBookingQueries";
import { useBookingFlow } from "./useBookingFlow";
import { NextIntlClientProvider } from "next-intl";
import { BookingSessionProvider } from "../components/BookingSession/BookingSessionProvider";
import ruMessages from "@/shared/i18n/messages/ru.json";
vi.mock("@/shared/i18n/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));
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
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <BookingSessionProvider>
        <NextIntlClientProvider
          locale="ru"
          messages={ruMessages}
          timeZone="Asia/Almaty"
        >
          {children}
        </NextIntlClientProvider>
      </BookingSessionProvider>
    </QueryClientProvider>
  );
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
  return { ...hook, client, wrapper };
};
beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(resolveBookingRequest).mockReset().mockResolvedValue(null);
  vi.mocked(getServices).mockResolvedValue([service]);
  vi.mocked(getBookingCalendar).mockResolvedValue(calendar);
  vi.mocked(getBookingAvailability).mockResolvedValue(available);
  vi.mocked(createBooking).mockReset();
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
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

describe("booking recovery after reload", () => {
  it("restores a committed booking without sending another creation request", async () => {
    vi.mocked(createBooking).mockRejectedValueOnce(new Error("Response lost"));
    const first = await setupFlow();
    act(() => first.result.current.submitContacts(contacts));
    await waitFor(() =>
      expect(first.result.current.canRetrySubmission).toBe(true),
    );
    const requestId = vi.mocked(createBooking).mock.calls[0]?.[0].requestId;
    expect(sessionStorage.getItem("booking.pendingRequestId")).toBe(requestId);
    expect(sessionStorage.length).toBe(1);
    first.unmount();
    first.client.clear();
    vi.mocked(resolveBookingRequest).mockResolvedValueOnce(receipt);
    const restored = renderHook(
      () => useBookingFlow({ status: "requested", serviceId: service.id }),
      { wrapper: first.wrapper },
    );
    await waitFor(() =>
      expect(restored.result.current.receipt).toEqual(receipt),
    );
    expect(resolveBookingRequest).toHaveBeenCalledWith(requestId);
    act(() => restored.result.current.submitContacts(contacts));
    expect(createBooking).toHaveBeenCalledTimes(1);
    first.client.clear();
  });
  it("keeps a new submission blocked while the previous result cannot be checked", async () => {
    const requestId = crypto.randomUUID();
    sessionStorage.setItem("booking.pendingRequestId", requestId);
    vi.mocked(resolveBookingRequest).mockRejectedValue(new Error("Offline"));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>
        <BookingSessionProvider>
          <NextIntlClientProvider
            locale="ru"
            messages={ruMessages}
            timeZone="Asia/Almaty"
          >
            {children}
          </NextIntlClientProvider>
        </BookingSessionProvider>
      </QueryClientProvider>
    );
    const hook = renderHook(
      () => useBookingFlow({ status: "requested", serviceId: service.id }),
      { wrapper },
    );
    await waitFor(() =>
      expect(hook.result.current.recovery.state.status).toBe("error"),
    );
    act(() => hook.result.current.submitContacts(contacts));
    expect(createBooking).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("booking.pendingRequestId")).toBe(requestId);
    client.clear();
  });
  it("releases a definitively missing attempt and uses a fresh identifier", async () => {
    const previousId = crypto.randomUUID();
    sessionStorage.setItem("booking.pendingRequestId", previousId);
    vi.mocked(createBooking).mockResolvedValueOnce(receipt);
    const hook = await setupFlow();
    await waitFor(() =>
      expect(hook.result.current.recovery.state).toMatchObject({
        status: "ready",
        wasNotCreated: true,
      }),
    );
    expect(sessionStorage.getItem("booking.pendingRequestId")).toBeNull();
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() => expect(hook.result.current.receipt).toEqual(receipt));
    expect(vi.mocked(createBooking).mock.calls[0]?.[0].requestId).not.toBe(
      previousId,
    );
    hook.client.clear();
  });
  it("does not send a booking if its recovery identifier cannot be saved", async () => {
    const hook = await setupFlow();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    act(() => hook.result.current.submitContacts(contacts));
    expect(hook.result.current.recovery.state.status).toBe("error");
    expect(createBooking).not.toHaveBeenCalled();
    hook.client.clear();
  });
  it("keeps recovery safe if browser storage becomes unavailable during submission", async () => {
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
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() => expect(hook.result.current.booking.isError).toBe(true));
    expect(hook.result.current.recovery.state.status).toBe("error");
    expect(sessionStorage.getItem("booking.pendingRequestId")).not.toBeNull();
    expect(createBooking).toHaveBeenCalledTimes(1);
    hook.client.clear();
  });
  it("uses a new identifier after a definitively closed request is rejected", async () => {
    vi.mocked(createBooking)
      .mockRejectedValueOnce(
        new AxiosError(
          "Closed request",
          "ERR_BAD_REQUEST",
          undefined,
          undefined,
          {
            status: 409,
            statusText: "Conflict",
            headers: {},
            config: { headers: new AxiosHeaders() },
            data: {
              error: { code: "REQUEST_CLOSED", message: "Attempt closed" },
            },
          },
        ),
      )
      .mockResolvedValueOnce(receipt);
    const hook = await setupFlow();
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() => expect(hook.result.current.booking.isError).toBe(true));
    expect(sessionStorage.getItem("booking.pendingRequestId")).toBeNull();
    act(() => hook.result.current.submitContacts(contacts));
    await waitFor(() => expect(hook.result.current.receipt).toEqual(receipt));
    const calls = vi.mocked(createBooking).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[1]?.[0].requestId).not.toBe(calls[0]?.[0].requestId);
    hook.client.clear();
  });
});

describe("booking language changes", () => {
  it("preserves the complete draft when the localized page remounts and keeps catalog caches separate", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    let changeLocale: (locale: PublicLocale) => void = () => {
      throw new Error("Locale harness is not mounted");
    };
    vi.mocked(getServices).mockImplementation(async (query) => [
      {
        ...service,
        name: query.locale === "kk" ? "Кірпікті ұзарту" : service.name,
      },
    ]);
    const LanguageHarness = ({ children }: { children: ReactNode }) => {
      const [locale, setLocale] = useState<PublicLocale>("ru");
      useEffect(() => {
        changeLocale = setLocale;
      }, []);
      return (
        <QueryClientProvider client={client}>
          <BookingSessionProvider>
            <NextIntlClientProvider
              locale={locale}
              messages={locale === "kk" ? kkMessages : ruMessages}
              timeZone="Asia/Almaty"
            >
              <div key={locale}>{children}</div>
            </NextIntlClientProvider>
          </BookingSessionProvider>
        </QueryClientProvider>
      );
    };
    const hook = renderHook(
      () => useBookingFlow({ status: "requested", serviceId: service.id }),
      { wrapper: LanguageHarness },
    );
    await waitFor(() =>
      expect(hook.result.current.selectedService?.id).toBe(service.id),
    );
    act(() => hook.result.current.selectDate(available.date));
    await waitFor(() =>
      expect(hook.result.current.availability.isSuccess).toBe(true),
    );
    const slot = available.slots[0];
    if (!slot) throw new Error("Fixture slot is missing");
    act(() => {
      hook.result.current.selectSlot(slot);
      hook.result.current.setContacts({
        clientName: "Әлия Құнанбай",
        clientPhone: "+7 (701) 123-45-67",
      });
      hook.result.current.setStep(3);
    });
    act(() => changeLocale("kk"));
    await waitFor(() =>
      expect(hook.result.current.selectedService?.name).toBe("Кірпікті ұзарту"),
    );
    expect(hook.result.current.step).toBe(3);
    expect(hook.result.current.date).toBe(available.date);
    expect(hook.result.current.slot).toEqual(slot);
    expect(hook.result.current.contacts).toEqual({
      clientName: "Әлия Құнанбай",
      clientPhone: "+7 (701) 123-45-67",
    });
    expect(createBooking).not.toHaveBeenCalled();
    expect(client.getQueryData(["services", "booking", "ru"])).toEqual([
      service,
    ]);
    act(() => changeLocale("ru"));
    await waitFor(() =>
      expect(hook.result.current.selectedService?.name).toBe(service.name),
    );
    expect(hook.result.current.step).toBe(3);
    expect(hook.result.current.contacts.clientName).toBe("Әлия Құнанбай");
    client.clear();
  });
});
