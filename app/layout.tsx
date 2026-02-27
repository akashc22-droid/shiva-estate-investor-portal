import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Shiva Estate Investor Portal — Your Investment. Your Transparency.",
  description:
    "A premium investor relations platform by Shiva Estate & Shiva Buildcon, Bhopal. Track your investment in Sankhedi Project, Pinaki Home & Salaiya Project. Monitor construction progress and view AI-powered return predictions.",
  keywords: "real estate investment, Shiva Estate, Shiva Buildcon, Bhopal property, Sankhedi Project, Pinaki Home, investor portal, Kolar Road",
  openGraph: {
    title: "Shiva Estate Investor Portal",
    description: "Track your investment. Monitor construction. Predict your returns.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-surface-dark text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
