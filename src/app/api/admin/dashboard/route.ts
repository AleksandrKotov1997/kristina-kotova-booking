import { NextRequest, NextResponse } from "next/server";
import { getAdminDashboard } from "@/server/adminBookings/adminBookingRepository";
import { withMasterApi } from "@/server/adminBookings/adminApi";
export const GET = (request: NextRequest) =>
  withMasterApi(request, async (context) =>
    NextResponse.json({ data: await getAdminDashboard(context) }),
  );
