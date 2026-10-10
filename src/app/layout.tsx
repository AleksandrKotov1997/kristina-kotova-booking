import type { Metadata } from "next";
import { DM_Serif_Display, Nunito } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kristina Kotova Lash & Brow Studio",
    template: "%s | Kristina Kotova",
  },
  description:
    "Наращивание и ламинирование ресниц, оформление бровей у Кристины Котовой в Астане. Услуги, цены в тенге и онлайн-запись.",
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    siteName: "Kristina Kotova Lash & Brow Studio",
    title: "Ресницы и брови в Астане | Kristina Kotova",
    description:
      "Наращивание и ламинирование ресниц, оформление бровей в Астане. Выберите процедуру и удобное время онлайн.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${nunito.variable} ${dmSerifDisplay.variable}`}>
      <body>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
