import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { bookingContactsSchema } from "../../model/schemas";
import type { BookingContacts, BookingContactsInput } from "../../model/types";
import styles from "./BookingContactsForm.module.css";
interface BookingContactsFormProps {
  defaultValues: BookingContacts;
  isSending: boolean;
  canSubmit: boolean;
  lockContacts: boolean;
  error: string | null;
  onSubmit: (values: BookingContacts) => void;
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
}: BookingContactsFormProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<BookingContactsInput, undefined, BookingContacts>({
    defaultValues,
    resolver: zodResolver(bookingContactsSchema),
    mode: "onBlur",
  });
  return (
    <form
      method="post"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="booking-client-name">Имя</label>
        <input
          id="booking-client-name"
          placeholder="Анна"
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
        <label htmlFor="booking-client-phone">Телефон / WhatsApp</label>
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
          Номер с кодом страны — мастер свяжется с вами для подтверждения.
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
          Выбранное время больше недоступно. Вернитесь к календарю и выберите
          свободный слот.
        </p>
      )}
      <div className={styles.actions}>
        <Button
          disabled={isSending || lockContacts}
          onClick={() => onBack(getValues())}
        >
          ← Назад
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSending}
          disabled={!canSubmit}
          className={styles.submit}
        >
          Отправить заявку
        </Button>
      </div>
    </form>
  );
};
