"use client";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Button, Skeleton } from "antd";
import { PublicActionLink } from "@/components/ActionLink";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import { getPublicBookingErrorCode } from "../../model/localizedBookingError";
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
  const t = useTranslations("Booking");
  const locale = useLocale();
  const common = useTranslations("Common");
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
  if (flow.recovery.state.status === "checking")
    return (
      <div
        className={[styles.booking, styles.card, styles.state].join(" ")}
        role="status"
        aria-busy="true"
      >
        <h2 className={styles.title}>{t("checking")}</h2>
        <p>{t("checkingHint")}</p>
      </div>
    );
  if (flow.recovery.state.status === "error")
    return (
      <div
        className={[styles.booking, styles.card, styles.state].join(" ")}
        role="alert"
      >
        <h2 className={styles.title}>{t("checkNeeded")}</h2>
        <p>{t(`recovery.${flow.recovery.state.code}`)}</p>
        <Button onClick={() => void flow.checkSubmissionResult()}>
          {t("checkAgain")}
        </Button>
      </div>
    );
  if (receipt)
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
          {receipt.status === "pending" ? t("sent") : t("yourBooking")}
        </h2>
        <p>
          {receipt.status === "pending"
            ? t("confirmation")
            : t("status", { status: t(`statuses.${receipt.status}`) })}
        </p>
        <BookingSummary
          serviceName={
            locale === "kk"
              ? (receipt.serviceNameKk ?? t("service"))
              : receipt.serviceName
          }
          price={receipt.servicePrice}
          durationMinutes={receipt.durationMinutes}
          date={receipt.date}
          startTime={receipt.startTime}
          endTime={receipt.endTime}
        />
        <PublicActionLink href="/" onClick={flow.recovery.forgetRequest}>
          {common("home")}
        </PublicActionLink>
      </div>
    );
  return (
    <div className={styles.booking}>
      <ol className={styles.steps} aria-label={t("steps")}>
        {[t("service"), t("dateTime"), t("contacts")].map((label, index) => (
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
        {flow.recovery.state.wasNotCreated && (
          <p className={styles.notice} role="status">
            {t("notCreated")}
          </p>
        )}
        {flow.services.isPending || flow.calendar.isPending ? (
          <div aria-busy="true">
            <p role="status">{t("loading")}</p>
            <Skeleton active />
          </div>
        ) : flow.services.isError || flow.calendar.isError ? (
          <div role="alert" className={styles.state}>
            <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
              {t("loadError")}
            </h2>
            <p>{t("retryHint")}</p>
            <Button
              loading={flow.services.isFetching || flow.calendar.isFetching}
              onClick={() => {
                void flow.services.refetch();
                void flow.calendar.refetch();
              }}
            >
              {common("retry")}
            </Button>
          </div>
        ) : flow.services.data.length === 0 ? (
          <p role="status">{t("noServices")}</p>
        ) : (
          <>
            {flow.step === 1 && (
              <>
                <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
                  {t("chooseService")}
                </h2>
                {selectionRequest.status === "invalid" && (
                  <p className={styles.notice} role="alert">
                    {t("invalidLink")}
                  </p>
                )}
                {flow.serviceId && !selectedService && (
                  <p className={styles.notice} role="alert">
                    {t("serviceUnavailable")}
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
                    {common("next")}
                  </Button>
                </div>
              </>
            )}
            {flow.step === 2 && selectedService && (
              <>
                <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
                  {t("chooseDate")}
                </h2>
                <p className={styles.service}>
                  {selectedService.name} ·{" "}
                  {common("minutes", {
                    count: selectedService.durationMinutes,
                  })}
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
                  <Button onClick={() => flow.setStep(1)}>
                    {common("back")}
                  </Button>
                  <Button
                    type="primary"
                    className={styles.primary}
                    disabled={!flow.isSlotAvailable}
                    onClick={() => flow.setStep(3)}
                  >
                    {common("next")}
                  </Button>
                </div>
              </>
            )}
            {flow.step === 3 && selectedService && date && slot && (
              <>
                <h2 ref={stepHeading} tabIndex={-1} className={styles.title}>
                  {t("yourContacts")}
                </h2>
                <BookingSummary
                  serviceName={selectedService.name}
                  price={selectedService.price}
                  durationMinutes={selectedService.durationMinutes}
                  date={date}
                  startTime={slot.startTime}
                  endTime={slot.endTime}
                />
                {flow.canRetrySubmission && (
                  <Button onClick={() => void flow.checkSubmissionResult()}>
                    {t("checkResult")}
                  </Button>
                )}
                <BookingContactsForm
                  defaultValues={flow.contacts}
                  isSending={flow.booking.isPending}
                  canSubmit={flow.isSlotAvailable || flow.canRetrySubmission}
                  lockContacts={flow.canRetrySubmission}
                  error={
                    flow.booking.isError
                      ? t(
                          `errors.${getPublicBookingErrorCode(flow.booking.error)}`,
                        )
                      : null
                  }
                  onSubmit={flow.submitContacts}
                  onChange={flow.setContacts}
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
