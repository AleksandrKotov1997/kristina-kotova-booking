"use client";

import { Pagination, Spin } from "antd";
import { formatPrice } from "@/shared/format/formatPrice";
import { formatBookingDate } from "../../model/formatBookingDate";
import { BookingActions } from "../BookingActions/BookingActions";
import { BookingStatus } from "../BookingStatus/BookingStatus";
import {
  BookingsTable,
  type BookingsTableProps,
} from "../BookingsTable/BookingsTable";
import styles from "./BookingsList.module.css";

interface BookingsListProps extends BookingsTableProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const BookingsList = ({
  bookings,
  total,
  page,
  pageSize,
  loading,
  disabled,
  onPageChange,
  onSelect,
}: BookingsListProps) => (
  <div className={styles.list} aria-busy={loading}>
    <div className={styles.desktop}>
      <BookingsTable
        bookings={bookings}
        loading={loading}
        disabled={disabled}
        onSelect={onSelect}
      />
    </div>
    <div className={styles.mobile}>
      <Spin spinning={loading}>
        {bookings.length ? (
          <ul className={styles.cards} aria-label="Записи клиентов">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <article className={styles.card}>
                  <div className={styles.heading}>
                    <h2>{booking.clientName}</h2>
                    <BookingStatus status={booking.status} />
                  </div>
                  <a
                    className={styles.phone}
                    href={"tel:" + booking.clientPhone}
                  >
                    {booking.clientPhone}
                  </a>
                  <p className={styles.service}>{booking.serviceName}</p>
                  <dl className={styles.details}>
                    <div>
                      <dt>Дата</dt>
                      <dd>{formatBookingDate(booking.date)}</dd>
                    </div>
                    <div>
                      <dt>Время</dt>
                      <dd>
                        {booking.startTime}–{booking.endTime}
                      </dd>
                    </div>
                    <div>
                      <dt>Стоимость</dt>
                      <dd>{formatPrice(booking.servicePrice)}</dd>
                    </div>
                  </dl>
                  <BookingActions
                    booking={booking}
                    onSelect={onSelect}
                    disabled={disabled}
                  />
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Записей по выбранным условиям нет.</p>
        )}
      </Spin>
    </div>
    <Pagination
      className={styles.pagination}
      current={page}
      pageSize={pageSize}
      total={total}
      showSizeChanger={false}
      showLessItems
      responsive
      disabled={loading}
      onChange={onPageChange}
      showTotal={(count, range) =>
        count
          ? "Показано " + range[0] + "–" + range[1] + " из " + count
          : "Всего 0 записей"
      }
    />
  </div>
);
