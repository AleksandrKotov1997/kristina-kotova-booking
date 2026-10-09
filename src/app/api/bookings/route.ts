import { NextRequest, NextResponse } from "next/server";
import { createBookingSchema } from "@/features/booking/model/schemas";
import { createBooking } from "@/server/booking/bookingRepository";
import { bookingErrorResponse } from "@/server/booking/bookingErrorResponse";
export const POST = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin)
    return NextResponse.json(
      {
        error: {
          code: "INVALID_ORIGIN",
          message: "Отправьте заявку через форму сайта.",
        },
      },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json(
      {
        error: {
          code: "INVALID_CONTENT_TYPE",
          message: "Ожидаются данные в формате JSON.",
        },
      },
      { status: 415 },
    );
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 4096)
    return NextResponse.json(
      {
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Размер заявки слишком большой.",
        },
      },
      { status: 413 },
    );
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return NextResponse.json(
      {
        error: { code: "INVALID_BODY", message: "Некорректный формат заявки." },
      },
      { status: 400 },
    );
  }
  const result = createBookingSchema.safeParse(input);
  if (!result.success)
    return NextResponse.json(
      {
        error: {
          code: "INVALID_BOOKING",
          message: "Проверьте имя, телефон, услугу, дату и время.",
        },
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { data: await createBooking(result.data) },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return bookingErrorResponse(error);
  }
};
