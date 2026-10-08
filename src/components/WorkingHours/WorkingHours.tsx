"use client";

import { Button, Skeleton } from "antd";
import { useWorkingHours } from "@/features/workingHours/hooks/useWorkingHours";
import { groupWorkingHours } from "@/features/workingHours/model/groupWorkingHours";
import styles from "./WorkingHours.module.css";

export const WorkingHours = () => {
  const workingHoursQuery = useWorkingHours();

  return (
    <div className={styles.card} aria-busy={workingHoursQuery.isPending}>
      <h3 className={styles.title}>Режим работы</h3>
      {workingHoursQuery.isPending ? (
        <>
          <p className={styles.message} role="status">
            Загрузка режима работы…
          </p>
          <div aria-hidden="true">
            <Skeleton active title={false} paragraph={{ rows: 2 }} />
          </div>
        </>
      ) : workingHoursQuery.isError ? (
        <div role="alert">
          <p className={styles.message}>Не удалось загрузить режим работы.</p>
          <Button
            type="link"
            size="small"
            className={styles.retryButton}
            loading={workingHoursQuery.isFetching}
            onClick={() => void workingHoursQuery.refetch()}
          >
            Повторить
          </Button>
        </div>
      ) : workingHoursQuery.data.length === 0 ? (
        <p className={styles.message}>Режим работы уточняется</p>
      ) : (
        <dl className={styles.schedule}>
          {groupWorkingHours(workingHoursQuery.data).map((group) => (
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
