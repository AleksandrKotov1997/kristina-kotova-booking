import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { refreshAuthSession } from "@/server/auth/refreshAuthSession";
import { routing } from "@/shared/i18n/routing";
const handlePublicLocale = createMiddleware(routing);
export const proxy = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/")
  ) {
    return refreshAuthSession(request);
  }
  // The initial language is Russian; a saved choice or an explicit URL wins.
  request.headers.set("accept-language", "ru");
  return handlePublicLocale(request);
};
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/api/auth/:path*",
    "/api/me",
    "/api/admin/:path*",
  ],
};
