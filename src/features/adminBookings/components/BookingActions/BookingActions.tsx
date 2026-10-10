"use client";
import { Button } from "antd";
import {
  canChangeBookingStatus,
  type BookingStatus,
} from "@/features/booking/model/bookingStatus";
import type { AdminBooking } from "../../model/types";
import styles from "./BookingActions.module.css";

const actions: { status: BookingStatus; label: string }[] = [
  { status: "confirmed", label: "Подтвердить" },
  { status: "completed", label: "Выполнена" },
  { status: "cancelled", label: "Отменить" },
];
export const BookingActions = ({
  booking,
  onSelect,
  disabled = false,
}: {
  booking: AdminBooking;
  onSelect: (booking: AdminBooking, status: BookingStatus) => void;
  disabled?: boolean;
}) => {
  const available = actions.filter((action) =>
    canChangeBookingStatus(booking.status, action.status),
  );
  if (!available.length)
    return <span className={styles.finished}>Обработана</span>;
  return (
    <div className={styles.actions}>
      {available.map((action) => (
        <Button
          key={action.status}
          size="small"
          disabled={disabled}
          className={
            action.status === "cancelled" ? styles.cancel : styles.action
          }
          onClick={() => onSelect(booking, action.status)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
