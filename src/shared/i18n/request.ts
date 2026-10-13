import { getRequestConfig } from "next-intl/server";
import { getPublicLocale, type PublicLocale } from "./locales";
import russianMessages from "./messages/ru.json";
import kazakhMessages from "./messages/kk.json";
const messagesByLocale: Record<PublicLocale, typeof russianMessages> = {
  ru: russianMessages,
  kk: kazakhMessages,
};
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = getPublicLocale((await requestLocale) ?? "ru");
  return {
    locale,
    messages: messagesByLocale[locale],
    timeZone: "Asia/Almaty",
  };
});
