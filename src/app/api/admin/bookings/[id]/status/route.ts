import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { changeBookingStatusSchema } from "@/features/adminBookings/model/schemas";
import { changeBookingStatus } from "@/server/adminBookings/adminBookingRepository";
import { withMasterApi } from "@/server/adminBookings/adminApi";
import { readJsonBody, HttpRequestError } from "@/shared/http/readJsonBody";

export const PATCH = (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) =>
  withMasterApi(request, async (context) => {
    const id = z.uuid().safeParse((await params).id);
    const input = changeBookingStatusSchema.safeParse(
      await readJsonBody(request),
    );
    if (!id.success || !input.success)
      throw new HttpRequestError(
        400,
        "INVALID_TRANSITION",
        "Проверьте запись и выбранный статус.",
      );
    return NextResponse.json({
      data: await changeBookingStatus(context, id.data, input.data),
    });
  });
