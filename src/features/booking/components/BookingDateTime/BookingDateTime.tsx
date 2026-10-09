import { useState } from "react";
import { Button, Calendar } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
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
  const [calendarValue, setCalendarValue] = useState(() =>
    dayjs(date ?? calendar.today).locale("ru"),
  );
  return (
    <div className={styles.layout}>
      <div className={styles.calendar}>
        <Calendar
          fullscreen={false}
          value={calendarValue}
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
              aria-label={formatBookingDate(day.format("YYYY-MM-DD"))}
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
                aria-label="Предыдущий месяц"
                disabled={!value.isAfter(dayjs(calendar.today), "month")}
                onClick={() => onChange(value.subtract(1, "month"))}
              >
                ‹
              </Button>
              <span className={styles.month}>
                {value.locale("ru").format("MMMM YYYY")}
              </span>
              <Button
                aria-label="Следующий месяц"
                disabled={!value.isBefore(dayjs(calendar.lastDate), "month")}
                onClick={() => onChange(value.add(1, "month"))}
              >
                ›
              </Button>
            </div>
          )}
        />
        <p className={styles.note}>
          Время указано для Астаны. Запись доступна до{" "}
          {formatBookingDate(calendar.lastDate)}
        </p>
      </div>
      <div
        className={styles.times}
        aria-live="polite"
        aria-busy={date !== null && isLoading}
      >
        {date === null ? (
          <p className={styles.placeholder}>
            Выберите дату, чтобы увидеть доступное время.
          </p>
        ) : (
          <>
            <h3 className={styles.date}>{formatBookingDate(date)}</h3>
            {isError ? (
              <div role="alert">
                <p>Не удалось загрузить доступное время.</p>
                <Button loading={isFetching} onClick={onRetry}>
                  Попробовать снова
                </Button>
              </div>
            ) : isLoading ? (
              <p role="status">Загружаем свободное время…</p>
            ) : !availability || availability.slots.length === 0 ? (
              <p role="status">
                На эту дату нет времени для выбранной процедуры. Выберите другой
                день.
              </p>
            ) : (
              <>
                <div className={styles.slots} aria-label="Время записи">
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
                        time.startTime +
                        (time.isAvailable ? "" : " — недоступно")
                      }
                      onClick={() => onSlotChange(time)}
                    >
                      {time.startTime}
                    </button>
                  ))}
                </div>
                {!availability.slots.some((time) => time.isAvailable) && (
                  <p role="status">Все слоты заняты. Выберите другой день.</p>
                )}
                <p className={styles.note}>
                  Недоступное время зачёркнуто. Процедура должна закончиться до
                  закрытия.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
