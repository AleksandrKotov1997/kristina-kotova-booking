"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {
  bookingStatusLabels,
  bookingStatusSchema,
} from "@/features/booking/model/bookingStatus";
import type { AdminBookingFilters } from "@/features/adminBookings/model/types";
import { buildAdminBookingsUrl } from "@/features/adminBookings/model/buildAdminBookingsUrl";
import { useAdminBookings } from "@/features/adminBookings/hooks/useAdminBookings";
import { useBookingStatusAction } from "@/features/adminBookings/hooks/useBookingStatusAction";
import { AdminQueryState } from "@/features/adminBookings/components/AdminQueryState/AdminQueryState";
import { AdminPageHeader } from "@/features/adminBookings/components/AdminPageHeader/AdminPageHeader";
import { BookingsList } from "@/features/adminBookings/components/BookingsList/BookingsList";
import { BookingStatusDialog } from "@/features/adminBookings/components/BookingActions/BookingStatusDialog";
import styles from "./AdminBookingsView.module.css";

export const AdminBookingsView = ({
  filters,
}: {
  filters: AdminBookingFilters;
}) => {
  const router = useRouter();
  const [changingFilters, startTransition] = useTransition();
  const query = useAdminBookings(filters);
  const action = useBookingStatusAction();
  const navigate = (next: AdminBookingFilters) =>
    startTransition(() =>
      router.replace(buildAdminBookingsUrl(next), { scroll: false }),
    );
  const updateFilters = (changes: Partial<AdminBookingFilters>) =>
    navigate({ ...filters, ...changes, page: 1 });
  return (
    <>
      <AdminPageHeader
        title="Все записи"
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />
      <div className={styles.filters} aria-busy={changingFilters}>
        <Input.Search
          key={filters.search}
          className={styles.search}
          defaultValue={filters.search}
          maxLength={100}
          allowClear
          aria-label="Поиск по имени, услуге или телефону"
          placeholder="Имя, услуга, телефон…"
          disabled={changingFilters}
          onSearch={(search) => updateFilters({ search: search.trim() })}
        />
        <DatePicker
          className={styles.date}
          value={filters.date ? dayjs(filters.date).locale("ru") : null}
          format="DD.MM.YYYY"
          inputReadOnly
          aria-label="Дата записи"
          placeholder="Любая дата"
          disabled={changingFilters}
          onChange={(date) =>
            updateFilters({ date: date?.format("YYYY-MM-DD") })
          }
        />
        <Button
          onClick={() => navigate({ page: 1, search: "" })}
          disabled={changingFilters}
        >
          Сбросить
        </Button>
        <div
          className={styles.statuses}
          role="group"
          aria-label="Фильтр по статусу"
        >
          <button
            type="button"
            disabled={changingFilters}
            aria-pressed={!filters.status}
            onClick={() => updateFilters({ status: undefined })}
          >
            Все
          </button>
          {bookingStatusSchema.options.map((status) => (
            <button
              key={status}
              type="button"
              disabled={changingFilters}
              aria-pressed={filters.status === status}
              onClick={() => updateFilters({ status })}
            >
              {bookingStatusLabels[status]}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.hint}>
        Сначала поздние даты. Все даты и время указаны по Астане.
      </p>
      {query.isError || !query.data ? (
        <AdminQueryState
          error={query.error}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : (
        <BookingsList
          bookings={query.data.items}
          total={query.data.total}
          page={query.data.page}
          pageSize={query.data.pageSize}
          loading={query.isFetching || changingFilters}
          disabled={
            action.mutation.isPending || changingFilters || query.isFetching
          }
          onSelect={action.select}
          onPageChange={(page) => navigate({ ...filters, page })}
        />
      )}
      <BookingStatusDialog action={action} />
    </>
  );
};
