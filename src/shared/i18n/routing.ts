import { defineRouting } from "next-intl/routing";
import {
  defaultLocale,
  localeCookieMaxAge,
  localeCookieName,
  publicLocales,
} from "./locales";
export const routing = defineRouting({
  locales: publicLocales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: localeCookieName,
    maxAge: localeCookieMaxAge,
    path: "/",
    sameSite: "lax",
  },
});
