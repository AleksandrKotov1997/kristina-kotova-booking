import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { createBookingContactsSchema } from "../../model/schemas";
import type { BookingContacts, BookingContactsInput } from "../../model/types";
import styles from "./BookingContactsForm.module.css";
interface BookingContactsFormProps {
  defaultValues: BookingContacts;
  isSending: boolean;
  canSubmit: boolean;
  lockContacts: boolean;
  error: string | null;
  onSubmit: (values: BookingContacts) => void;
  onChange: (values: BookingContactsInput) => void;
  onBack: (values: BookingContactsInput) => void;
}
export const BookingContactsForm = ({
  defaultValues,
  isSending,
  canSubmit,
  lockContacts,
  error,
  onSubmit,
  onBack,
  onChange,
}: BookingContactsFormProps) => {
  const t = useTranslations("Booking");
  const common = useTranslations("Common");
  const {
    register,
    subscribe,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<BookingContactsInput, undefined, BookingContacts>({
    defaultValues,
    resolver: zodResolver(
      createBookingContactsSchema({
        nameShort: t("validation.nameShort"),
        nameLong: t("validation.nameLong"),
        nameCharacters: t("validation.nameCharacters"),
        phone: t("validation.phone"),
      }),
    ),
    mode: "onBlur",
  });
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => onChange(values),
      }),
    [subscribe, onChange],
  );
  return (
    <form
      method="post"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="booking-client-name">{t("name")}</label>
        <input
          id="booking-client-name"
          placeholder={t("namePlaceholder")}
          autoComplete="given-name"
          maxLength={100}
          aria-invalid={!!errors.clientName}
          aria-describedby={
            errors.clientName ? "booking-name-error" : undefined
          }
          readOnly={isSending || lockContacts}
          {...register("clientName")}
        />
        {errors.clientName && (
          <p className={styles.error} id="booking-name-error" role="alert">
            {errors.clientName.message}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="booking-client-phone">{t("phone")}</label>
        <input
          id="booking-client-phone"
          type="tel"
          placeholder="+7 (701) 123-45-67"
          autoComplete="tel"
          maxLength={32}
          aria-invalid={!!errors.clientPhone}
          aria-describedby={
            errors.clientPhone ? "booking-phone-error" : "booking-phone-hint"
          }
          readOnly={isSending || lockContacts}
          {...register("clientPhone")}
        />
        <p className={styles.hint} id="booking-phone-hint">
          {t("phoneHint")}
        </p>
        {errors.clientPhone && (
          <p className={styles.error} id="booking-phone-error" role="alert">
            {errors.clientPhone.message}
          </p>
        )}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!canSubmit && !isSending && (
        <p className={styles.error} role="alert">
          {t("slotChanged")}
        </p>
      )}
      <div className={styles.actions}>
        <Button
          disabled={isSending || lockContacts}
          onClick={() => onBack(getValues())}
        >
          {common("back")}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSending}
          disabled={!canSubmit}
          className={styles.submit}
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
};
