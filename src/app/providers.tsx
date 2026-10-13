"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUnprefixedPathname } from "@/shared/i18n/locales";
import { BookingSessionProvider } from "@/features/booking/components/BookingSession/BookingSessionProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = /^\/kk(?:\/|$)/.test(pathname)
      ? "kk"
      : "ru";
  }, [pathname]);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ruRU}
        theme={{ token: { fontFamily: "var(--font-body)" } }}
      >
        <BookingSessionProvider
          key={
            getUnprefixedPathname(pathname) === "/booking"
              ? "booking"
              : "public"
          }
        >
          {children}
        </BookingSessionProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
