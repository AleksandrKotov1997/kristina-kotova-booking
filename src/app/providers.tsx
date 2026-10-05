"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ token: { fontFamily: "var(--font-body)" } }}>
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
}
