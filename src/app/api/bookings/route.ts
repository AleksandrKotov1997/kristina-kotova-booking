import { NextRequest, NextResponse } from "next/server";
import { createBookingSchema } from "@/features/booking/model/schemas";
import { createBooking } from "@/server/booking/bookingRepository";
import { bookingErrorResponse } from "@/server/booking/bookingErrorResponse";
import { readJsonBody } from "@/shared/http/readJsonBody";

export const POST = async (request: NextRequest) => {
  try {
    const result = createBookingSchema.safeParse(await readJsonBody(request));
    if (!result.success)
      return NextResponse.json(
        {
          error: {
            code: "INVALID_BOOKING",
            message: "Проверьте имя, телефон, услугу, дату и время.",
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    return NextResponse.json(
      { data: await createBooking(result.data) },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return bookingErrorResponse(error);
  }
};
