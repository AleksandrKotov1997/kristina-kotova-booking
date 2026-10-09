import type { Metadata } from "next";
import { requireMaster } from "@/server/auth/masterAccess";
import { adminBookingFiltersSchema } from "@/features/adminBookings/model/schemas";
import { AdminBookingsView } from "@/views/AdminBookingsView/AdminBookingsView";
import { ActionLink } from "@/components/ActionLink";
export const metadata: Metadata = {
  title: "Записи · Кабинет мастера",
  robots: { index: false, follow: false },
};
export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireMaster();
  const filters = adminBookingFiltersSchema.safeParse(await searchParams);
  if (!filters.success)
    return (
      <>
        <h1>Проверьте фильтры записей</h1>
        <p>В адресе указан неизвестный статус, дата или страница.</p>
        <ActionLink href="/admin/bookings">Сбросить фильтры</ActionLink>
      </>
    );
  return <AdminBookingsView filters={filters.data} />;
}
