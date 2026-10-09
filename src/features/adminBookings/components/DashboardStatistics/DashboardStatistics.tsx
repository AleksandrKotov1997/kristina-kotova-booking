import Link from "next/link";
import styles from "./DashboardStatistics.module.css";
export const DashboardStatistics = ({
  counts,
}: {
  counts: {
    pending: number;
    confirmed: number;
    completed: number;
    total: number;
  };
}) => {
  const cards = [
    {
      key: "pending",
      label: "Новые заявки",
      value: counts.pending,
      href: "/admin/bookings?status=pending",
      path: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
    },
    {
      key: "confirmed",
      label: "Подтверждённые",
      value: counts.confirmed,
      href: "/admin/bookings?status=confirmed",
      path: "M8 2v4m8-4v4M3 10h18M4 4h16v18H4zM8 14h2m4 0h2m-8 4h2",
    },
    {
      key: "completed",
      label: "Выполненные",
      value: counts.completed,
      href: "/admin/bookings?status=completed",
      path: "m2 12 5 5L17 7m-6 10L22 6",
    },
    {
      key: "total",
      label: "Всего записей",
      value: counts.total,
      href: "/admin/bookings",
      path: "m3 17 6-6 4 4 8-10m-7 0h7v7",
    },
  ];
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className={styles.card + " " + styles[card.key]}
        >
          <span className={styles.icon} aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={card.path} />
            </svg>
          </span>
          <strong>{card.value}</strong>
          <span>{card.label}</span>
        </Link>
      ))}
    </div>
  );
};
