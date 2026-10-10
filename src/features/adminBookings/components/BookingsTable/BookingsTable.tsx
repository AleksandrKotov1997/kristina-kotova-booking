"use client";
import { Table, type TableColumnsType } from "antd";
import type { BookingStatus as BookingStatusValue } from "@/features/booking/model/bookingStatus";
import type { AdminBooking } from "../../model/types";
import { formatBookingDate } from "../../model/formatBookingDate";
import { formatPrice } from "@/shared/format/formatPrice";
import { BookingStatus } from "../BookingStatus/BookingStatus";
import { BookingActions } from "../BookingActions/BookingActions";
import styles from "./BookingsTable.module.css";

export interface BookingsTableProps {
  bookings: AdminBooking[];
  loading: boolean;
  disabled: boolean;
  onSelect: (booking: AdminBooking, status: BookingStatusValue) => void;
}

export const BookingsTable = ({
  bookings,
  loading,
  disabled,
  onSelect,
}: BookingsTableProps) => {
  const columns: TableColumnsType<AdminBooking> = [
    {
      title: "Клиент",
      key: "client",
      width: 210,
      render: (_value: unknown, booking) => (
        <div className={styles.cell}>
          <strong>{booking.clientName}</strong>
          <a href={"tel:" + booking.clientPhone}>{booking.clientPhone}</a>
        </div>
      ),
    },
    {
      title: "Услуга",
      key: "service",
      width: 240,
      render: (_value: unknown, booking) => (
        <div className={styles.cell}>
          <span>{booking.serviceName}</span>
          <small>{formatPrice(booking.servicePrice)}</small>
        </div>
      ),
    },
    {
      title: "Дата",
      key: "date",
      width: 140,
      render: (_value: unknown, booking) => formatBookingDate(booking.date),
    },
    {
      title: "Время",
      key: "time",
      width: 120,
      render: (_value: unknown, booking) => (
        <span className={styles.time}>
          {booking.startTime}–{booking.endTime}
        </span>
      ),
    },
    {
      title: "Статус",
      key: "status",
      width: 160,
      render: (_value: unknown, booking) => (
        <BookingStatus status={booking.status} />
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 200,
      render: (_value: unknown, booking) => (
        <BookingActions
          booking={booking}
          onSelect={onSelect}
          disabled={disabled}
        />
      ),
    },
  ];
  return (
    <div className={styles.table}>
      <Table<AdminBooking>
        rowKey="id"
        columns={columns}
        dataSource={bookings}
        loading={loading}
        scroll={{ x: 1070 }}
        locale={{ emptyText: "Записей по выбранным условиям нет." }}
        pagination={false}
      />
    </div>
  );
};
