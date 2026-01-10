"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on resources detail pages (it's included in the page content)
  if (pathname.startsWith('/resources/') && pathname !== '/resources') {
    return null;
  }
  
  return <Footer />;
}

