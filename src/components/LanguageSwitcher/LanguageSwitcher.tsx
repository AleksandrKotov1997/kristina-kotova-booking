"use client";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useBookingSession } from "@/features/booking/components/BookingSession/BookingSessionProvider";
import { publicLocales, type PublicLocale } from "@/shared/i18n/locales";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import styles from "./LanguageSwitcher.module.css";
export const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const { isSubmitting } = useBookingSession();
  const [isChanging, startTransition] = useTransition();
  const switchLanguage = (nextLocale: PublicLocale) => {
    if (nextLocale === locale || isChanging || isSubmitting) return;
    const href = pathname + window.location.search + window.location.hash;
    startTransition(() =>
      router.replace(href, { locale: nextLocale, scroll: false }),
    );
  };
  return (
    <div
      className={styles.switcher}
      role="group"
      aria-label={t("language")}
      aria-busy={isChanging}
    >
      {publicLocales.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-label={t(language === "ru" ? "russian" : "kazakh")}
          aria-pressed={language === locale}
          disabled={isChanging || isSubmitting}
          title={isSubmitting ? t("languageBusy") : undefined}
          onClick={() => switchLanguage(language)}
        >
          {language === "ru" ? "РУС" : "ҚАЗ"}
        </button>
      ))}
    </div>
  );
};
