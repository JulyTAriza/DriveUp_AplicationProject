// app/layout.tsx
import "./globals.css";
import { NavBar } from "@components";
import { AuthProvider } from "@components/AuthContext";
import FooterWrapper from "@components/FooterWrapper";
import WhatsAppWrapper from "@/components/WhatsAppWrapper"; // 👈

export const metadata = {
  title: "DriveUp",
  description: "Discover world's best car showcase application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <AuthProvider>
          <NavBar />
          <main className="pt-20">{children}</main>
          <FooterWrapper />
          <WhatsAppWrapper /> {/* 👈 Botón flotante solo en ciertas rutas */}
        </AuthProvider>
      </body>
    </html>
  );
}

