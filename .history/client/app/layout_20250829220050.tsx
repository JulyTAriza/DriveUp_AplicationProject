// app/layout.tsx
import "./globals.css";
import { NavBar } from "@components";
import { AuthProvider } from "@components/AuthContext";
import FooterWrapper from "@components/FooterWrapper"; // 👈 Importa el nuevo componente

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
          <FooterWrapper /> {/* 👈 Usa el componente que maneja la lógica */}
        </AuthProvider>
      </body>
    </html>
  );
}
