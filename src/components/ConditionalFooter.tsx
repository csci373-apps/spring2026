"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on pages that use ContentLayout (footer is included in ContentLayout)
  // These pages use the 'content-layout-page' class
  const usesContentLayout = pathname === '/' || 
                            pathname === '/syllabus' ||
                            pathname === '/assignments' ||
                            pathname.startsWith('/assignments/') ||
                            pathname === '/activities' ||
                            pathname.startsWith('/activities/') ||
                            pathname === '/resources' ||
                            pathname.startsWith('/resources/');
  
  if (usesContentLayout) {
    return null;
  }
  
  return <Footer />;
}

