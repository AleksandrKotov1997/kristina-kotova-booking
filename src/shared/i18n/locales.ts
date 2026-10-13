import { z } from "zod";
export const publicLocales: readonly ["ru", "kk"] = ["ru", "kk"];
export const localeSchema = z.enum(publicLocales);
export type PublicLocale = z.infer<typeof localeSchema>;
export const defaultLocale: PublicLocale = "ru";
export const localeCookieName = "studio.locale";
export const localeCookieMaxAge = 60 * 60 * 24 * 365;
export const getPublicLocale = (value: string): PublicLocale => {
  const result = localeSchema.safeParse(value);
  return result.success ? result.data : defaultLocale;
};
export const getUnprefixedPathname = (pathname: string) =>
  pathname.replace(/^\/(ru|kk)(?=\/|$)/, "") || "/";
