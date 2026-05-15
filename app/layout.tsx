import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "The TreeHouse",
  description: "Boutique hotel in Mérida, Yucatán.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={garamond.variable}>
      <body className="bg-treehouse-paper text-treehouse-ink antialiased">
        {children}
      </body>
    </html>
  );
}
