"use client";

import { Button, Skeleton } from "antd";
import { ActionLink } from "@/components/ActionLink";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { useServiceById } from "@/features/services/hooks/useServiceById";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import { formatPrice } from "@/shared/format/formatPrice";
import styles from "./BookingServiceSelection.module.css";

interface BookingServiceSelectionProps {
  selectionRequest: ServiceSelectionRequest;
}

export const BookingServiceSelection = ({
  selectionRequest,
}: BookingServiceSelectionProps) => {
  const serviceId =
    selectionRequest.status === "requested" ? selectionRequest.serviceId : null;
  const serviceQuery = useServiceById(serviceId);

  if (selectionRequest.status === "empty") {
    return (
      <div className={styles.state}>
        <h2 className={styles.stateTitle}>Выберите процедуру</h2>
        <p>
          В каталоге указаны описания, стоимость и длительность каждой услуги.
        </p>
        <ActionLink href="/services">Выбрать услугу</ActionLink>
      </div>
    );
  }

  if (selectionRequest.status === "invalid") {
    return (
      <div className={styles.state} role="alert">
        <h2 className={styles.stateTitle}>Некорректная ссылка на услугу</h2>
        <p>Выберите процедуру из актуального каталога.</p>
        <ActionLink href="/services">Выбрать услугу</ActionLink>
      </div>
    );
  }

  if (serviceQuery.isPending) {
    return (
      <div className={styles.loading} aria-busy="true">
        <p className={styles.loadingLabel} role="status">
          Загрузка выбранной услуги…
        </p>
        <div aria-hidden="true">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      </div>
    );
  }

  if (serviceQuery.isError) {
    return (
      <div className={styles.state} role="alert">
        <h2 className={styles.stateTitle}>Не удалось загрузить услугу</h2>
        <p>Попробуйте получить актуальные данные ещё раз.</p>
        <Button
          className={styles.retryButton}
          loading={serviceQuery.isFetching}
          onClick={() => void serviceQuery.refetch()}
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  const service = serviceQuery.data;

  if (service === null) {
    return (
      <div className={styles.state} role="alert">
        <h2 className={styles.stateTitle}>Услуга сейчас недоступна</h2>
        <p>Она больше не доступна для записи. Выберите другую процедуру.</p>
        <ActionLink href="/services">Выбрать другую услугу</ActionLink>
      </div>
    );
  }

  return (
    <article className={styles.card} aria-labelledby="selected-service-title">
      <SectionEyebrow alignment="start">Выбранная услуга</SectionEyebrow>
      <h2 className={styles.title} id="selected-service-title">
        {service.name}
      </h2>
      <p className={styles.description}>{service.description}</p>
      <dl className={styles.details}>
        <div>
          <dt>Стоимость</dt>
          <dd>от {formatPrice(service.price)}</dd>
        </div>
        <div>
          <dt>Длительность</dt>
          <dd>{service.durationMinutes} мин</dd>
        </div>
      </dl>
      <ActionLink href="/services" variant="secondary">
        Изменить услугу
      </ActionLink>
    </article>
  );
};
