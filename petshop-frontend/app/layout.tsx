import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthHydration } from "@/components/providers/auth-hydration";
import "./globals.css";

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Huellitas | Tienda de mascotas",
  description: "Alimento, accesorios y cuidado premium para tu mascota.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${fontDisplay.variable} ${fontBody.variable}`}>
        <AuthHydration />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
