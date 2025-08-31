import "./globals.css";
import { Footer, NavBar } from "@components";
import { AuthProvider } from "@components/AuthContext"; // 👈 importa el contexto

export const metadata = {
  title: "DriveUp",
  description: "Discover world's best car showcase application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <AuthProvider>   {/* 👈 envolvemos todo dentro del provider */}
          <NavBar />
          <main className="pt-20">{children}</main> {/* 👈 padding top para no tapar contenido */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

