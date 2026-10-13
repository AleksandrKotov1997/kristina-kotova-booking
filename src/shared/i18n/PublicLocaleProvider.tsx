"use client";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import kkKZ from "antd/locale/kk_KZ";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
export const PublicLocaleProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocale();
  return (
    <ConfigProvider locale={locale === "kk" ? kkKZ : ruRU}>
      {children}
    </ConfigProvider>
  );
};
