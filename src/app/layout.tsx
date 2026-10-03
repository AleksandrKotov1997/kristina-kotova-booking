import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kristina Kotova Lash & Brow Studio",
  description:
    "Сайт мастера по ресницам и бровям Кристины Котовой: услуги, работы и онлайн-запись.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
