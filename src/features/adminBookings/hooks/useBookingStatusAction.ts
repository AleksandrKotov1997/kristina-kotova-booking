"use client";
import { useState } from "react";
import type { BookingStatus } from "@/features/booking/model/bookingStatus";
import type { AdminBooking } from "../model/types";
import { useChangeBookingStatus } from "./useAdminBookings";

export const useBookingStatusAction = () => {
  const mutation = useChangeBookingStatus();
  const [selection, setSelection] = useState<{
    booking: AdminBooking;
    status: BookingStatus;
  } | null>(null);
  return {
    selection,
    mutation,
    select: (booking: AdminBooking, status: BookingStatus) => {
      if (mutation.isPending) return;
      mutation.reset();
      setSelection({ booking, status });
    },
    close: () => {
      if (!mutation.isPending) {
        setSelection(null);
        mutation.reset();
      }
    },
    submit: () => {
      if (!selection || mutation.isPending) return;
      mutation.mutate(
        {
          id: selection.booking.id,
          expectedStatus: selection.booking.status,
          status: selection.status,
        },
        { onSuccess: () => setSelection(null) },
      );
    },
  };
};
