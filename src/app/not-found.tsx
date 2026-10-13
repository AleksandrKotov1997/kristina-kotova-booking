import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { AppLayout } from "@/components/AppLayout";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { PublicActionLink } from "@/components/ActionLink";
import { PublicLocaleProvider } from "@/shared/i18n/PublicLocaleProvider";
export default async function NotFoundPage() {
  const locale = await getLocale();
  const [messages, t, common] = await Promise.all([
    getMessages({ locale }),
    getTranslations({ locale, namespace: "PageState" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Almaty"
    >
      <PublicLocaleProvider>
        <AppLayout>
          <PublicPageHeading
            eyebrow="404"
            title={t("notFound")}
            description={t("notFoundDescription")}
            actions={
              <PublicActionLink href="/">{common("home")}</PublicActionLink>
            }
          />
        </AppLayout>
      </PublicLocaleProvider>
    </NextIntlClientProvider>
  );
}
