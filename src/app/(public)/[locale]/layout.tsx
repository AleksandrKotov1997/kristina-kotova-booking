import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AppLayout } from "@/components/AppLayout";
import { localeSchema, publicLocales } from "@/shared/i18n/locales";
import { PublicLocaleProvider } from "@/shared/i18n/PublicLocaleProvider";
export const generateStaticParams = () =>
  publicLocales.map((locale) => ({ locale }));
export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const result = localeSchema.safeParse((await params).locale);
  if (!result.success) return notFound();
  const locale = result.data;
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Almaty"
    >
      <PublicLocaleProvider>
        <AppLayout>{children}</AppLayout>
      </PublicLocaleProvider>
    </NextIntlClientProvider>
  );
}
