import { NextRequest, NextResponse } from "next/server";
import { bookingAvailabilityQuerySchema } from "@/features/booking/model/schemas";
import { getBookingAvailability } from "@/server/booking/bookingRepository";
import { bookingErrorResponse } from "@/server/booking/bookingErrorResponse";
export const dynamic = "force-dynamic";
export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const query = bookingAvailabilityQuerySchema.safeParse(
    Object.fromEntries(params),
  );
  if (
    !query.success ||
    params.getAll("serviceId").length !== 1 ||
    params.getAll("date").length !== 1
  )
    return NextResponse.json(
      {
        error: {
          code: "INVALID_QUERY",
          message: "Некорректные параметры времени записи.",
        },
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      {
        data: await getBookingAvailability(
          query.data.serviceId,
          query.data.date,
        ),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return bookingErrorResponse(error);
  }
};
