import { NextRequest, NextResponse } from "next/server";
import { getBookingCalendar } from "@/server/booking/bookingRepository";
import { bookingErrorResponse } from "@/server/booking/bookingErrorResponse";
export const dynamic = "force-dynamic";
export const GET = async (request: NextRequest) => {
  if (request.nextUrl.searchParams.size > 0)
    return NextResponse.json(
      {
        error: {
          code: "INVALID_QUERY",
          message: "Некорректные параметры календаря.",
        },
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { data: await getBookingCalendar() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return bookingErrorResponse(error);
  }
};
