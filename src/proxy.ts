import type { NextRequest } from "next/server";
import { refreshAuthSession } from "@/server/auth/refreshAuthSession";

export const proxy = (request: NextRequest) => refreshAuthSession(request);
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/me",
    "/api/admin/:path*",
  ],
};
