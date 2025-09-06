"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (pathname.startsWith('/resources')) {
        mainElement.setAttribute('data-resources-layout', 'true');
      } else {
        mainElement.removeAttribute('data-resources-layout');
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
