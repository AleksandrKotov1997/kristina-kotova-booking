import { NextRequest, NextResponse } from "next/server";
import { adminBookingFiltersSchema } from "@/features/adminBookings/model/schemas";
import { getAdminBookings } from "@/server/adminBookings/adminBookingRepository";
import { withMasterApi } from "@/server/adminBookings/adminApi";
import { HttpRequestError } from "@/shared/http/readJsonBody";

export const GET = (request: NextRequest) =>
  withMasterApi(request, async (context) => {
    const parameters: Record<string, string> = {};
    for (const [name, value] of request.nextUrl.searchParams) {
      if (
        !["page", "status", "date", "search"].includes(name) ||
        Object.hasOwn(parameters, name)
      )
        throw new HttpRequestError(
          400,
          "INVALID_FILTERS",
          "Проверьте фильтры списка.",
        );
      parameters[name] = value;
    }
    const parsed = adminBookingFiltersSchema.safeParse(parameters);
    if (!parsed.success)
      throw new HttpRequestError(
        400,
        "INVALID_FILTERS",
        "Проверьте фильтры списка.",
      );
    return NextResponse.json({
      data: await getAdminBookings(context, parsed.data),
    });
  });
