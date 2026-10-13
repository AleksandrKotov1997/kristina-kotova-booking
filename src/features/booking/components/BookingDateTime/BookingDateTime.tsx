import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Calendar } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/kk";
import type {
  BookingAvailability,
  BookingCalendar,
  BookingSlot,
} from "../../model/types";
import {
  formatBookingDate,
  isBookingDateSelectable,
} from "../../model/calendar";
import styles from "./BookingDateTime.module.css";
interface BookingDateTimeProps {
  calendar: BookingCalendar;
  date: string | null;
  slot: BookingSlot | null;
  availability: BookingAvailability | null | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: BookingSlot) => void;
  onRetry: () => void;
}
export const BookingDateTime = ({
  calendar,
  date,
  slot,
  availability,
  isLoading,
  isError,
  isFetching,
  onDateChange,
  onSlotChange,
  onRetry,
}: BookingDateTimeProps) => {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const common = useTranslations("Common");
  const [calendarValue, setCalendarValue] = useState(() =>
    dayjs(date ?? calendar.today).locale(locale),
  );
  return (
    <div className={styles.layout}>
      <div className={styles.calendar}>
        <Calendar
          fullscreen={false}
          value={calendarValue.locale(locale)}
          onChange={setCalendarValue}
          validRange={[dayjs(calendar.today), dayjs(calendar.lastDate)]}
          disabledDate={(day) =>
            !isBookingDateSelectable(day.format("YYYY-MM-DD"), calendar)
          }
          fullCellRender={(day) => (
            <button
              type="button"
              className={[
                styles.day,
                date === day.format("YYYY-MM-DD") ? styles.selectedDay : "",
              ].join(" ")}
              aria-label={formatBookingDate(day.format("YYYY-MM-DD"), locale)}
              aria-pressed={date === day.format("YYYY-MM-DD")}
              disabled={
                !isBookingDateSelectable(day.format("YYYY-MM-DD"), calendar)
              }
              onClick={(event) => {
                event.stopPropagation();
                setCalendarValue(day);
                onDateChange(day.format("YYYY-MM-DD"));
              }}
            >
              {day.date()}
            </button>
          )}
          onSelect={(day, info) => {
            if (info.source === "date") onDateChange(day.format("YYYY-MM-DD"));
          }}
          headerRender={({ value, onChange }) => (
            <div className={styles.monthNavigation}>
              <Button
                aria-label={t("previousMonth")}
                disabled={!value.isAfter(dayjs(calendar.today), "month")}
                onClick={() => onChange(value.subtract(1, "month"))}
              >
                ‹
              </Button>
              <span className={styles.month}>
                {value.locale(locale).format("MMMM YYYY")}
              </span>
              <Button
                aria-label={t("nextMonth")}
                disabled={!value.isBefore(dayjs(calendar.lastDate), "month")}
                onClick={() => onChange(value.add(1, "month"))}
              >
                ›
              </Button>
            </div>
          )}
        />
        <p className={styles.note}>
          {t("calendarHint", {
            date: formatBookingDate(calendar.lastDate, locale),
          })}
        </p>
      </div>
      <div
        className={styles.times}
        aria-live="polite"
        aria-busy={date !== null && isLoading}
      >
        {date === null ? (
          <p className={styles.placeholder}>{t("chooseDateHint")}</p>
        ) : (
          <>
            <h3 className={styles.date}>{formatBookingDate(date, locale)}</h3>
            {isError ? (
              <div role="alert">
                <p>{t("availabilityError")}</p>
                <Button loading={isFetching} onClick={onRetry}>
                  {common("retry")}
                </Button>
              </div>
            ) : isLoading ? (
              <p role="status">{t("availabilityLoading")}</p>
            ) : !availability || availability.slots.length === 0 ? (
              <p role="status">{t("noSlots")}</p>
            ) : (
              <>
                <div className={styles.slots} aria-label={t("timeLabel")}>
                  {availability.slots.map((time) => (
                    <button
                      type="button"
                      key={time.startTime}
                      className={[
                        styles.slot,
                        slot?.startTime === time.startTime
                          ? styles.selected
                          : "",
                      ].join(" ")}
                      aria-pressed={slot?.startTime === time.startTime}
                      disabled={!time.isAvailable}
                      aria-label={
                        time.isAvailable
                          ? time.startTime
                          : t("unavailableTime", { time: time.startTime })
                      }
                      onClick={() => onSlotChange(time)}
                    >
                      {time.startTime}
                    </button>
                  ))}
                </div>
                {!availability.slots.some((time) => time.isAvailable) && (
                  <p role="status">{t("allOccupied")}</p>
                )}
                <p className={styles.note}>{t("availabilityHint")}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
