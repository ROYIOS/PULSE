import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/300.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PULSE — People & Workforce Management",
  description: "Gestión de incidencias, vacaciones y retardos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
