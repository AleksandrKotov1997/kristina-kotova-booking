"use client";

import { useState } from "react";
import { Button, Empty, Skeleton } from "antd";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { useServices } from "@/features/services/hooks/useServices";
import { serviceCategoryOptions } from "@/features/services/model/constants";
import type { ServiceCategory } from "@/features/services/model/types";
import styles from "./HomeServicesPreview.module.css";

export const HomeServicesPreview = () => {
  const [category, setCategory] = useState<ServiceCategory>("lashes");
  const servicesQuery = useServices(category);

  return (
    <section
      id="services"
      className={styles.section}
      aria-labelledby="services-title"
    >
      <PageContainer>
        <SectionHeading
          id="services-title"
          eyebrow="Прайс-лист"
          title="Услуги"
          description="Профессиональный уход за ресницами и бровями. Индивидуальный подбор эффекта для каждого взгляда."
        />
        <div
          className={styles.categories}
          role="group"
          aria-label="Категория услуг"
        >
          {serviceCategoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.categoryButton}
              aria-pressed={category === option.value}
              aria-controls="services-list"
              onClick={() => setCategory(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div id="services-list" aria-busy={servicesQuery.isPending}>
          {servicesQuery.isPending ? (
            <>
              <p className={styles.loadingLabel} role="status">
                Загрузка услуг…
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
              <h3 className={styles.stateTitle}>Не удалось загрузить услуги</h3>
              <p>Попробуйте обновить список ещё раз.</p>
              <Button
                className={styles.retryButton}
                loading={servicesQuery.isFetching}
                onClick={() => void servicesQuery.refetch()}
              >
                Попробовать снова
              </Button>
            </div>
          ) : servicesQuery.data.length === 0 ? (
            <div className={styles.state} role="status">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="В этой категории пока нет доступных услуг"
              />
            </div>
          ) : (
            <ul className={styles.grid} aria-label="Доступные услуги">
              {servicesQuery.data.map((service) => (
                <li className={styles.item} key={service.id}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageContainer>
    </section>
  );
};
