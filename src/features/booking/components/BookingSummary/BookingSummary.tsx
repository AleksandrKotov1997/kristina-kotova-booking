import { formatPrice } from "@/shared/format/formatPrice";
import { formatBookingDate } from "../../model/calendar";
import styles from "./BookingSummary.module.css";
interface BookingSummaryProps {
  serviceName: string;
  price: number;
  durationMinutes: number;
  date: string;
  startTime: string;
  endTime: string;
}
export const BookingSummary = ({
  serviceName,
  price,
  durationMinutes,
  date,
  startTime,
  endTime,
}: BookingSummaryProps) => (
  <dl className={styles.summary}>
    <div>
      <dt>Услуга</dt>
      <dd>{serviceName}</dd>
    </div>
    <div>
      <dt>Дата</dt>
      <dd>{formatBookingDate(date)}</dd>
    </div>
    <div>
      <dt>Время в Астане</dt>
      <dd>
        {startTime}–{endTime} · {durationMinutes} мин
      </dd>
    </div>
    <div>
      <dt>Стоимость</dt>
      <dd>от {formatPrice(price)}</dd>
    </div>
  </dl>
);
