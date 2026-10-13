import "server-only";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";
import { HttpRequestError } from "@/shared/http/readJsonBody";

const databaseErrorSchema = z.object({ message: z.string() });
const bookingErrors = {
  SLOT_UNAVAILABLE: {
    status: 409,
    message: "Это время уже недоступно. Выберите другой свободный слот.",
  },
  SERVICE_UNAVAILABLE: {
    status: 404,
    message: "Услуга сейчас недоступна. Выберите другую процедуру.",
  },
  INVALID_DATE: {
    status: 400,
    message: "Выберите дату в доступном диапазоне календаря.",
  },
  INVALID_BOOKING: { status: 400, message: "Проверьте данные заявки." },
  REQUEST_REUSED: {
    status: 409,
    message:
      "Данные заявки изменились. Вернитесь к выбору времени и отправьте новую заявку.",
  },
  REQUEST_CLOSED: {
    status: 409,
    message:
      "Эта попытка отправки завершена без записи. Проверьте результат и выберите время заново.",
  },
};
const bookingErrorCodeSchema = z.enum([
  "SLOT_UNAVAILABLE",
  "SERVICE_UNAVAILABLE",
  "INVALID_DATE",
  "INVALID_BOOKING",
  "REQUEST_REUSED",
  "REQUEST_CLOSED",
]);
export const bookingErrorResponse = (error: unknown) => {
  if (error instanceof HttpRequestError)
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  let databaseMessage: string | undefined;
  if (isAxiosError<unknown>(error)) {
    const result = databaseErrorSchema.safeParse(error.response?.data);
    if (result.success) databaseMessage = result.data.message;
  }
  const result = bookingErrorCodeSchema.safeParse(databaseMessage);
  if (result.success) {
    const response = bookingErrors[result.data];
    return NextResponse.json(
      { error: { code: result.data, message: response.message } },
      { status: response.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  console.error("[booking] Не удалось выполнить запрос к Supabase.");
  return NextResponse.json(
    {
      error: {
        code: "UNAVAILABLE",
        message: "Сервис записи временно недоступен. Попробуйте снова.",
      },
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
};
