import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noveno - Agencia de Marketing",
  description: "Aesthetic single page application para la agencia Noveno.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
