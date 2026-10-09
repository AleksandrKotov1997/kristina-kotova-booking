import "server-only";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";
const databaseErrorSchema = z.object({ message: z.string() });
export const bookingErrorResponse = (error: unknown) => {
  let databaseMessage: string | undefined;
  if (isAxiosError<unknown>(error)) {
    const result = databaseErrorSchema.safeParse(error.response?.data);
    if (result.success) databaseMessage = result.data.message;
  }
  const errors = {
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
  };
  const result = z
    .enum([
      "SLOT_UNAVAILABLE",
      "SERVICE_UNAVAILABLE",
      "INVALID_DATE",
      "INVALID_BOOKING",
      "REQUEST_REUSED",
    ])
    .safeParse(databaseMessage);
  if (result.success) {
    const response = errors[result.data];
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
