import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/shared/i18n/navigation";
import { useLocale } from "next-intl";
import {
  createEmptyBookingDraft,
  useBookingSession,
} from "../components/BookingSession/BookingSessionProvider";
import { useEffect, useTransition } from "react";
import { getServices } from "@/features/services/api/getServices";
import { servicesQueryKey } from "@/features/services/model/constants";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import type { Service } from "@/features/services/model/types";
import { createBooking } from "../api/bookingApi";
import { getBookingError } from "../api/bookingError";
import type { BookingContacts, BookingSlot } from "../model/types";
import {
  bookingQueryKey,
  useBookingAvailability,
  useBookingCalendar,
} from "./useBookingQueries";
import { useBookingRecovery } from "./useBookingRecovery";

export const useBookingFlow = (selectionRequest: ServiceSelectionRequest) => {
  const router = useRouter();
  const recovery = useBookingRecovery();
  const isRecoveryReady = recovery.state.status === "ready";
  const [isChoosingService, startServiceTransition] = useTransition();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const { draft, setDraft, lastRequestRef, setIsSubmitting } =
    useBookingSession();
  const { step, serviceId, date, slot, contacts, receipt } = draft;
  const selectionKey =
    selectionRequest.status === "requested"
      ? selectionRequest.serviceId
      : selectionRequest.status;
  const requestedServiceId =
    selectionRequest.status === "requested" ? selectionRequest.serviceId : null;
  useEffect(() => {
    setDraft((current) =>
      current.selectionKey === selectionKey
        ? current
        : {
            ...createEmptyBookingDraft(),
            selectionKey,
            serviceId: requestedServiceId,
          },
    );
  }, [selectionKey, requestedServiceId, setDraft]);
  const setStep = (value: 1 | 2 | 3) =>
    setDraft((current) => ({ ...current, step: value }));
  const setServiceId = (value: string) =>
    setDraft((current) => ({
      ...current,
      serviceId: value,
      selectionKey: value,
    }));
  const setDate = (value: string | null) =>
    setDraft((current) => ({ ...current, date: value }));
  const setSlot = (value: BookingSlot | null) =>
    setDraft((current) => ({ ...current, slot: value }));
  const setContacts = (value: BookingContacts) =>
    setDraft((current) => ({ ...current, contacts: value }));
  const services = useQuery({
    queryKey: [...servicesQueryKey, "booking", locale],
    queryFn: ({ signal }) => getServices({ locale }, signal),
    staleTime: 0,
    retry: 1,
  });
  const calendar = useBookingCalendar();
  const selectedService = services.data?.find(
    (service) => service.id === serviceId,
  );
  const availability = useBookingAvailability(
    serviceId ?? "",
    selectedService ? date : null,
  );
  const isSlotAvailable =
    !!slot &&
    !availability.isError &&
    !!availability.data?.slots.some(
      (time) =>
        time.isAvailable &&
        time.startTime === slot.startTime &&
        time.endTime === slot.endTime,
    );
  const booking = useMutation({
    mutationFn: createBooking,
    retry: false,
    onError: (error) => {
      const code = getBookingError(error).code;
      if (code !== "UNAVAILABLE") {
        lastRequestRef.current = null;
        recovery.forgetRequest();
      }
      if (code === "SLOT_UNAVAILABLE")
        void queryClient.invalidateQueries({ queryKey: bookingQueryKey });
    },
    onSuccess: (result) => {
      setDraft((current) => ({ ...current, receipt: result }));
      void queryClient.invalidateQueries({ queryKey: bookingQueryKey });
    },
  });
  useEffect(() => {
    setIsSubmitting(booking.isPending);
    return () => setIsSubmitting(false);
  }, [booking.isPending, setIsSubmitting]);
  const canRetrySubmission =
    booking.isError &&
    getBookingError(booking.error).code === "UNAVAILABLE" &&
    booking.variables !== undefined;
  const isSelectionLocked =
    !isRecoveryReady || booking.isPending || canRetrySubmission;
  const selectService = (service: Service) => {
    if (isSelectionLocked) return;
    setServiceId(service.id);
    setDate(null);
    setSlot(null);
    booking.reset();
    startServiceTransition(() =>
      router.replace("/booking?serviceId=" + encodeURIComponent(service.id), {
        scroll: false,
      }),
    );
  };
  const selectDate = (selectedDate: string) => {
    if (isSelectionLocked) return;
    setDate(selectedDate);
    setSlot(null);
    booking.reset();
  };
  const selectSlot = (selectedSlot: BookingSlot) => {
    if (isSelectionLocked) return;
    setSlot(selectedSlot);
    booking.reset();
  };
  const submitContacts = (values: BookingContacts) => {
    if (
      recovery.state.status !== "ready" ||
      receipt ||
      recovery.state.receipt ||
      !selectedService ||
      !date ||
      !slot ||
      (!isSlotAvailable && !canRetrySubmission) ||
      booking.isPending
    )
      return;
    setContacts(values);
    const previous = lastRequestRef.current;
    const sameRequest =
      previous &&
      previous.serviceId === selectedService.id &&
      previous.date === date &&
      previous.startTime === slot.startTime &&
      previous.clientName === values.clientName &&
      previous.clientPhone === values.clientPhone;
    const input = {
      ...values,
      serviceId: selectedService.id,
      date,
      startTime: slot.startTime,
      requestId: sameRequest ? previous.requestId : crypto.randomUUID(),
    };
    if (!recovery.rememberRequest(input.requestId)) return;
    lastRequestRef.current = input;
    booking.mutate(input);
  };
  const checkSubmissionResult = async () => {
    const result = await recovery.checkResult();
    if (result.status === "ready" && !result.receipt) {
      lastRequestRef.current = null;
      booking.reset();
      setDate(null);
      setSlot(null);
      setStep(2);
      void queryClient.invalidateQueries({ queryKey: bookingQueryKey });
    }
  };
  return {
    step: selectedService ? step : 1,
    setStep,
    services,
    calendar,
    availability,
    selectedService,
    serviceId,
    isChoosingService,
    date,
    slot,
    contacts,
    setContacts,
    canRetrySubmission,
    receipt:
      receipt ??
      (recovery.state.status === "ready" ? recovery.state.receipt : null),
    recovery,
    checkSubmissionResult,
    booking,
    isSlotAvailable,
    selectService,
    selectDate,
    selectSlot,
    submitContacts,
  };
};
