import { useLocale, useTranslations } from "next-intl";
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
}: BookingSummaryProps) => {
  const t = useTranslations("Booking");
  const common = useTranslations("Common");
  const locale = useLocale();
  return (
    <dl className={styles.summary}>
      <div>
        <dt>{t("service")}</dt>
        <dd>{serviceName}</dd>
      </div>
      <div>
        <dt>{t("date")}</dt>
        <dd>{formatBookingDate(date, locale)}</dd>
      </div>
      <div>
        <dt>{t("astanaTime")}</dt>
        <dd>
          {startTime}–{endTime} ·{" "}
          {common("minutes", { count: durationMinutes })}
        </dd>
      </div>
      <div>
        <dt>{t("price")}</dt>
        <dd>{common("priceFrom", { price: formatPrice(price) })}</dd>
      </div>
    </dl>
  );
};
