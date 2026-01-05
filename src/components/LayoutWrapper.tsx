"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // Only apply resources layout to detail pages (with slug), not the landing page
      if (pathname.startsWith('/resources/') && pathname !== '/resources') {
        mainElement.setAttribute('data-resources-layout', 'true');
      } else {
        mainElement.removeAttribute('data-resources-layout');
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
