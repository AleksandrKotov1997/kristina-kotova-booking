import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { getServices } from "@/features/services/api/getServices";
import { servicesQueryKey } from "@/features/services/model/constants";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import type { Service } from "@/features/services/model/types";
import { createBooking } from "../api/bookingApi";
import { getBookingError } from "../api/bookingError";
import type {
  BookingContacts,
  BookingReceipt,
  BookingSlot,
  CreateBookingInput,
} from "../model/types";
import {
  bookingQueryKey,
  useBookingAvailability,
  useBookingCalendar,
} from "./useBookingQueries";

export const useBookingFlow = (selectionRequest: ServiceSelectionRequest) => {
  const router = useRouter();
  const [isChoosingService, startServiceTransition] = useTransition();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serviceId, setServiceId] = useState(
    selectionRequest.status === "requested" ? selectionRequest.serviceId : null,
  );
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<BookingSlot | null>(null);
  const [contacts, setContacts] = useState<BookingContacts>({
    clientName: "",
    clientPhone: "",
  });
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const lastRequest = useRef<CreateBookingInput | null>(null);
  const services = useQuery({
    queryKey: [...servicesQueryKey, "booking"],
    queryFn: ({ signal }) => getServices({}, signal),
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
      if (getBookingError(error).code === "SLOT_UNAVAILABLE")
        void queryClient.invalidateQueries({ queryKey: bookingQueryKey });
    },
    onSuccess: (result) => {
      setReceipt(result);
      void queryClient.invalidateQueries({ queryKey: bookingQueryKey });
    },
  });
  const canRetrySubmission =
    booking.isError &&
    getBookingError(booking.error).code === "UNAVAILABLE" &&
    booking.variables !== undefined;
  const selectService = (service: Service) => {
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
    setDate(selectedDate);
    setSlot(null);
    booking.reset();
  };
  const selectSlot = (selectedSlot: BookingSlot) => {
    setSlot(selectedSlot);
    booking.reset();
  };
  const submitContacts = (values: BookingContacts) => {
    if (
      !selectedService ||
      !date ||
      !slot ||
      (!isSlotAvailable && !canRetrySubmission) ||
      booking.isPending
    )
      return;
    setContacts(values);
    const previous = lastRequest.current;
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
    lastRequest.current = input;
    booking.mutate(input);
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
    receipt,
    booking,
    isSlotAvailable,
    selectService,
    selectDate,
    selectSlot,
    submitContacts,
  };
};
