"use client";
import { useEffect, useRef } from "react";
import { Button, Skeleton } from "antd";
import { ActionLink } from "@/components/ActionLink";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import { getBookingError } from "../../api/bookingError";
import { useBookingFlow } from "../../hooks/useBookingFlow";
import { BookingContactsForm } from "../BookingContactsForm/BookingContactsForm";
import { BookingDateTime } from "../BookingDateTime/BookingDateTime";
import { BookingServicePicker } from "../BookingServicePicker/BookingServicePicker";
import { BookingSummary } from "../BookingSummary/BookingSummary";
import styles from "./BookingFlow.module.css";
interface BookingFlowProps {
  selectionRequest: ServiceSelectionRequest;
}
export const BookingFlow = ({ selectionRequest }: BookingFlowProps) => {
  const flow = useBookingFlow(selectionRequest);
  const { selectedService, date, slot, receipt } = flow;
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const navigationKey = flow.step + ":" + (receipt?.id ?? "");
  const previousNavigationKey = useRef(navigationKey);

  useEffect(() => {
    if (previousNavigationKey.current === navigationKey) return;
    previousNavigationKey.current = navigationKey;
    stepHeading.current?.focus({ preventScroll: true });
    stepHeading.current?.scrollIntoView({ block: "start" });
  }, [navigationKey]);
  if (receipt)
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
          Заявка отправлена
        </h2>
        <p>
          Заявка отправлена. Мастер свяжется с вами в течение 10 минут для
          уточнения и подтверждения записи.
        </p>
        <BookingSummary
          serviceName={receipt.serviceName}
          price={receipt.servicePrice}
          durationMinutes={receipt.durationMinutes}
          date={receipt.date}
          startTime={receipt.startTime}
          endTime={receipt.endTime}
        />
        <ActionLink href="/">На главную</ActionLink>
      </div>
    );
  return (
    <div className={styles.booking}>
      <ol className={styles.steps} aria-label="Этапы записи">
        {["Услуга", "Дата и время", "Контакты"].map((label, index) => (
          <li
            key={label}
            className={flow.step >= index + 1 ? styles.activeStep : ""}
            aria-current={flow.step === index + 1 ? "step" : undefined}
          >
            <span className={styles.stepNumber} aria-hidden="true">
              {flow.step > index + 1 ? "✓" : index + 1}
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
      <div className={styles.card}>
        {flow.services.isPending || flow.calendar.isPending ? (
          <div aria-busy="true">
            <p role="status">Загружаем каталог и расписание…</p>
            <Skeleton active />
          </div>
        ) : flow.services.isError || flow.calendar.isError ? (
          <div role="alert" className={styles.state}>
            <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
              Не удалось загрузить запись
            </h2>
            <p>Попробуйте получить актуальные услуги и расписание ещё раз.</p>
            <Button
              loading={flow.services.isFetching || flow.calendar.isFetching}
              onClick={() => {
                void flow.services.refetch();
                void flow.calendar.refetch();
              }}
            >
              Попробовать снова
            </Button>
          </div>
        ) : flow.services.data.length === 0 ? (
          <p role="status">Услуги сейчас недоступны для записи.</p>
        ) : (
          <>
            {flow.step === 1 && (
              <>
                <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
                  Выберите услугу
                </h2>
                {selectionRequest.status === "invalid" && (
                  <p className={styles.notice} role="alert">
                    Некорректная ссылка на услугу. Выберите процедуру ниже.
                  </p>
                )}
                {flow.serviceId && !selectedService && (
                  <p className={styles.notice} role="alert">
                    Услуга сейчас недоступна. Выберите другую процедуру.
                  </p>
                )}
                <BookingServicePicker
                  services={flow.services.data}
                  selectedServiceId={flow.serviceId}
                  onSelect={flow.selectService}
                />
                <div className={styles.actions}>
                  <Button
                    type="primary"
                    className={styles.primary}
                    disabled={!selectedService || flow.isChoosingService}
                    onClick={() => flow.setStep(2)}
                  >
                    Далее →
                  </Button>
                </div>
              </>
            )}
            {flow.step === 2 && selectedService && (
              <>
                <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
                  Выберите дату и время
                </h2>
                <p className={styles.service}>
                  {selectedService.name} · {selectedService.durationMinutes} мин
                </p>
                <BookingDateTime
                  calendar={flow.calendar.data}
                  date={date}
                  slot={slot}
                  availability={flow.availability.data}
                  isLoading={flow.availability.isPending}
                  isError={flow.availability.isError}
                  isFetching={flow.availability.isFetching}
                  onDateChange={flow.selectDate}
                  onSlotChange={flow.selectSlot}
                  onRetry={() => void flow.availability.refetch()}
                />
                <div className={styles.actions}>
                  <Button onClick={() => flow.setStep(1)}>← Назад</Button>
                  <Button
                    type="primary"
                    className={styles.primary}
                    disabled={!flow.isSlotAvailable}
                    onClick={() => flow.setStep(3)}
                  >
                    Далее →
                  </Button>
                </div>
              </>
            )}
            {flow.step === 3 && selectedService && date && slot && (
              <>
                <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
                  Ваши контакты
                </h2>
                <BookingSummary
                  serviceName={selectedService.name}
                  price={selectedService.price}
                  durationMinutes={selectedService.durationMinutes}
                  date={date}
                  startTime={slot.startTime}
                  endTime={slot.endTime}
                />
                <BookingContactsForm
                  defaultValues={flow.contacts}
                  isSending={flow.booking.isPending}
                  canSubmit={flow.isSlotAvailable || flow.canRetrySubmission}
                  lockContacts={flow.canRetrySubmission}
                  error={
                    flow.booking.isError
                      ? getBookingError(flow.booking.error).message
                      : null
                  }
                  onSubmit={flow.submitContacts}
                  onBack={(values) => {
                    flow.setContacts(values);
                    flow.booking.reset();
                    flow.setStep(2);
                    void flow.availability.refetch();
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
