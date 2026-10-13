import type russianMessages from "./messages/ru.json";
import type { PublicLocale } from "./locales";
declare module "next-intl" {
  interface AppConfig {
    Locale: PublicLocale;
    Messages: typeof russianMessages;
  }
}
