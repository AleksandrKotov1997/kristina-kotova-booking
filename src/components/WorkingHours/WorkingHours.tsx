"use client";
import { useTranslations } from "next-intl";

import { Button, Skeleton } from "antd";
import { useWorkingHours } from "@/features/workingHours/hooks/useWorkingHours";
import { groupWorkingHours } from "@/features/workingHours/model/groupWorkingHours";
import styles from "./WorkingHours.module.css";

export const WorkingHours = () => {
  const t = useTranslations("WorkingHours");
  const workingHoursQuery = useWorkingHours();

  return (
    <div className={styles.card} aria-busy={workingHoursQuery.isPending}>
      <h3 className={styles.title}>{t("title")}</h3>
      {workingHoursQuery.isPending ? (
        <>
          <p className={styles.message} role="status">
            {t("loading")}
          </p>
          <div aria-hidden="true">
            <Skeleton active title={false} paragraph={{ rows: 2 }} />
          </div>
        </>
      ) : workingHoursQuery.isError ? (
        <div role="alert">
          <p className={styles.message}>{t("error")}</p>
          <Button
            type="link"
            size="small"
            className={styles.retryButton}
            loading={workingHoursQuery.isFetching}
            onClick={() => void workingHoursQuery.refetch()}
          >
            {t("retry")}
          </Button>
        </div>
      ) : workingHoursQuery.data.length === 0 ? (
        <p className={styles.message}>{t("pending")}</p>
      ) : (
        <dl className={styles.schedule}>
          {groupWorkingHours(workingHoursQuery.data, {
            weekdays: {
              1: t("weekdays.1"),
              2: t("weekdays.2"),
              3: t("weekdays.3"),
              4: t("weekdays.4"),
              5: t("weekdays.5"),
              6: t("weekdays.6"),
              7: t("weekdays.7"),
            },
            daily: t("daily"),
            unknown: t("unknown"),
            dayOff: t("dayOff"),
            hours: (start, end) => t("hours", { start, end }),
          }).map((group) => (
            <div className={styles.row} key={group.key}>
              <dt>{group.daysLabel}</dt>
              <dd>{group.hoursLabel}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};
