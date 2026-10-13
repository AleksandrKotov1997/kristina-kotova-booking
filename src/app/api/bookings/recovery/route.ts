import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveBookingRequest } from "@/server/booking/bookingRepository";
import { bookingErrorResponse } from "@/server/booking/bookingErrorResponse";
import { readJsonBody } from "@/shared/http/readJsonBody";

const recoveryInputSchema = z.strictObject({ requestId: z.uuidv4() });

export const POST = async (request: NextRequest) => {
  try {
    const input = recoveryInputSchema.safeParse(await readJsonBody(request));
    if (!input.success)
      return NextResponse.json(
        {
          error: {
            code: "INVALID_BOOKING",
            message: "Некорректный идентификатор отправки.",
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    return NextResponse.json(
      { data: await resolveBookingRequest(input.data.requestId) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return bookingErrorResponse(error);
  }
};
