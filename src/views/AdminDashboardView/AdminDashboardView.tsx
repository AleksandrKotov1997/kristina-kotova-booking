"use client";
import { useAdminDashboard } from "@/features/adminBookings/hooks/useAdminBookings";
import { useBookingStatusAction } from "@/features/adminBookings/hooks/useBookingStatusAction";
import { AdminQueryState } from "@/features/adminBookings/components/AdminQueryState/AdminQueryState";
import { AdminPageHeader } from "@/features/adminBookings/components/AdminPageHeader/AdminPageHeader";
import { DashboardStatistics } from "@/features/adminBookings/components/DashboardStatistics/DashboardStatistics";
import { BookingPreview } from "@/features/adminBookings/components/BookingPreview/BookingPreview";
import { BookingStatusDialog } from "@/features/adminBookings/components/BookingActions/BookingStatusDialog";
import styles from "./AdminDashboardView.module.css";

export const AdminDashboardView = () => {
  const query = useAdminDashboard();
  const action = useBookingStatusAction();
  return (
    <>
      <AdminPageHeader
        title="Обзор записей"
        refreshing={query.isFetching}
        onRefresh={() => {
          void query.refetch();
        }}
      />
      {query.isError || !query.data ? (
        <AdminQueryState
          error={query.error}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : (
        <>
          <DashboardStatistics counts={query.data.counts} />
          <div className={styles.columns}>
            <BookingPreview
              title={"Новые заявки (" + query.data.counts.pending + ")"}
              bookings={query.data.newBookings}
              emptyMessage="Новых заявок пока нет."
              href="/admin/bookings?status=pending"
              onSelect={action.select}
              disabled={action.mutation.isPending}
            />
            <BookingPreview
              title="Ближайшие записи"
              bookings={query.data.upcomingBookings}
              emptyMessage="Ближайших записей пока нет."
              href="/admin/bookings"
              onSelect={action.select}
              disabled={action.mutation.isPending}
            />
          </div>
        </>
      )}
      <BookingStatusDialog action={action} />
    </>
  );
};
