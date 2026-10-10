import { ActionLink } from "@/components/ActionLink";
import type { BookingStatus as BookingStatusValue } from "@/features/booking/model/bookingStatus";
import type { AdminBooking } from "../../model/types";
import { formatBookingDate } from "../../model/formatBookingDate";
import { BookingStatus } from "../BookingStatus/BookingStatus";
import { BookingActions } from "../BookingActions/BookingActions";
import styles from "./BookingPreview.module.css";
export const BookingPreview = ({
  title,
  bookings,
  emptyMessage,
  href,
  onSelect,
  disabled,
}: {
  title: string;
  bookings: AdminBooking[];
  emptyMessage: string;
  href: string;
  onSelect: (booking: AdminBooking, status: BookingStatusValue) => void;
  disabled: boolean;
}) => (
  <section className={styles.panel}>
    <h2>{title}</h2>
    {bookings.length ? (
      <ul className={styles.list}>
        {bookings.map((booking) => (
          <li key={booking.id} className={styles.booking}>
            <div className={styles.title}>
              <strong>{booking.clientName}</strong>
              <BookingStatus status={booking.status} />
            </div>
            <p>{booking.serviceName}</p>
            <p>
              {formatBookingDate(booking.date)} · {booking.startTime}–
              {booking.endTime}
            </p>
            <a className={styles.phone} href={"tel:" + booking.clientPhone}>
              {booking.clientPhone}
            </a>
            <BookingActions
              booking={booking}
              onSelect={onSelect}
              disabled={disabled}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.empty}>{emptyMessage}</p>
    )}
    <div className={styles.footer}>
      <ActionLink href={href} variant="secondary" size="compact">
        Все записи →
      </ActionLink>
    </div>
  </section>
);
