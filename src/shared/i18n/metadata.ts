import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { localeSchema } from "./locales";
import { getPathname } from "./navigation";
type PublicPage = "home" | "services" | "works" | "about" | "booking";
const siteUrl = "https://kristina-kotova-booking.vercel.app";
export const getPublicPageMetadata = async (
  localeValue: string,
  page: PublicPage,
): Promise<Metadata> => {
  const result = localeSchema.safeParse(localeValue);
  if (!result.success) return notFound();
  const locale = result.data;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const href = page === "home" ? "/" : "/" + page;
  const canonical = siteUrl + getPathname({ locale, href });
  return {
    title: t(`${page}Title`),
    description: t(`${page}Description`),
    alternates: {
      canonical,
      languages: {
        "ru-KZ": siteUrl + getPathname({ locale: "ru", href }),
        "kk-KZ": siteUrl + getPathname({ locale: "kk", href }),
      },
    },
    openGraph: {
      title: t(`${page}Title`),
      description: t(`${page}Description`),
      url: canonical,
      locale: locale === "kk" ? "kk_KZ" : "ru_KZ",
      alternateLocale: locale === "kk" ? "ru_KZ" : "kk_KZ",
      siteName: "Kristina Kotova Lash & Brow Studio",
      type: "website",
    },
  };
};
