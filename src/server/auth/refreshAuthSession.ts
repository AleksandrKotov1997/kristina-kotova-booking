import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createAuthContext } from "./createAuthContext";

export const refreshAuthSession = async (request: NextRequest) => {
  try {
    const context = createAuthContext(request.cookies.getAll());
    await context.client.auth.getUser();
    context.updateRequestCookies(request);
    return context.applyResponseCookies(NextResponse.next({ request }));
  } catch {
    // Access checks in layouts/API remain mandatory and fail closed if Auth is unavailable.
    const response = NextResponse.next({ request });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
};
