"use client";
import { useTranslations } from "next-intl";

import { useId, useState } from "react";
import { Button, Empty, Skeleton } from "antd";
import { ServiceCard } from "@/components/ServiceCard";
import { useServices } from "../../hooks/useServices";
import { serviceCategoryOptions } from "../../model/constants";
import type { ServiceCategory } from "../../model/types";
import styles from "./ServicesCatalog.module.css";

interface ServicesCatalogProps {
  serviceHeadingLevel?: 2 | 3;
}

export const ServicesCatalog = ({
  serviceHeadingLevel = 3,
}: ServicesCatalogProps) => {
  const t = useTranslations("Services");
  const common = useTranslations("Common");
  const [category, setCategory] = useState<ServiceCategory>("lashes");
  const servicesQuery = useServices(category);
  const listId = useId();

  return (
    <>
      <div
        className={styles.categories}
        role="group"
        aria-label={t("categoryLabel")}
      >
        {serviceCategoryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.categoryButton}
            aria-pressed={category === option.value}
            aria-controls={listId}
            onClick={() => setCategory(option.value)}
          >
            {common(option.value)}
          </button>
        ))}
      </div>
      <div id={listId} aria-busy={servicesQuery.isPending}>
        {servicesQuery.isPending ? (
          <>
            <p className={styles.loadingLabel} role="status">
              {t("loading")}
            </p>
            <div className={styles.grid} aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <div className={styles.skeleton} key={index}>
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              ))}
            </div>
          </>
        ) : servicesQuery.isError ? (
          <div className={styles.state} role="alert">
            <p className={styles.stateTitle}>{t("loadError")}</p>
            <p>{t("retryHint")}</p>
            <Button
              className={styles.retryButton}
              loading={servicesQuery.isFetching}
              onClick={() => void servicesQuery.refetch()}
            >
              {common("retry")}
            </Button>
          </div>
        ) : servicesQuery.data.length === 0 ? (
          <div className={styles.state} role="status">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("empty")}
            />
          </div>
        ) : (
          <ul className={styles.grid} aria-label={t("availableLabel")}>
            {servicesQuery.data.map((service) => (
              <li className={styles.item} key={service.id}>
                <ServiceCard
                  service={service}
                  headingLevel={serviceHeadingLevel}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
