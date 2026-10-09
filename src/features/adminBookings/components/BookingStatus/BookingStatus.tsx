import {
  bookingStatusLabels,
  type BookingStatus as BookingStatusValue,
} from "@/features/booking/model/bookingStatus";
import styles from "./BookingStatus.module.css";
export const BookingStatus = ({ status }: { status: BookingStatusValue }) => (
  <span className={styles.badge + " " + styles[status]}>
    {bookingStatusLabels[status]}
  </span>
);
