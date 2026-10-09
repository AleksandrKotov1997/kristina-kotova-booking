import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { AuthDatabase } from "@/shared/supabase/authDatabase";
import { getSupabaseEnvironment } from "@/shared/supabase/getSupabaseEnvironment";

interface AuthCookie {
  name: string;
  value: string;
  options: CookieOptions;
}

export const createAuthContext = (
  initialCookies: { name: string; value: string }[],
) => {
  const environment = getSupabaseEnvironment();
  const cookieValues = new Map(
    initialCookies.map(({ name, value }) => [name, value]),
  );
  const updates = new Map<string, AuthCookie>();
  const responseHeaders = new Headers();
  const client = createServerClient<AuthDatabase>(
    environment.url,
    environment.publishableKey,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
      global: {
        fetch: (input, options) =>
          fetch(input, {
            ...options,
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
          }),
      },
      cookies: {
        getAll: () =>
          Array.from(cookieValues, ([name, value]) => ({ name, value })),
        setAll: (cookiesToSet, headers) => {
          for (const cookie of cookiesToSet) {
            cookieValues.set(cookie.name, cookie.value);
            updates.set(cookie.name, cookie);
          }
          for (const [name, value] of Object.entries(headers))
            responseHeaders.set(name, value);
        },
      },
    },
  );
  return {
    client,
    updateRequestCookies: (request: NextRequest) => {
      for (const { name, value } of updates.values())
        request.cookies.set(name, value);
    },
    applyResponseCookies: (response: NextResponse) => {
      for (const { name, value, options } of updates.values())
        response.cookies.set(name, value, options);
      responseHeaders.forEach((value, name) =>
        response.headers.set(name, value),
      );
      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    },
  };
};
export type AuthContext = ReturnType<typeof createAuthContext>;
