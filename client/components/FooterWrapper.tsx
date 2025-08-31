// components/FooterWrapper.tsx
'use client'; // ¡Importante! Esto lo convierte en un componente de cliente

import { usePathname } from 'next/navigation'; // Hook para obtener la ruta
import Footer from './Footer'; // Importa tu componente Footer original

const FooterWrapper = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Si la ruta es la página de inicio ('/'), renderiza el Footer.
  // De lo contrario, no renderiza nada (null).
  return isHomePage ? <Footer /> : null;
};

export default FooterWrapper;