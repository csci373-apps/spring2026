"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on pages that use ContentLayout (footer is included in ContentLayout)
  // These pages use the 'content-layout-page' class
  // Normalize pathname by removing base path if present
  const normalizedPath = pathname.replace(/^\/spring2026/, '') || '/';
  
  const usesContentLayout = normalizedPath === '/' || 
                            normalizedPath === '/syllabus' ||
                            normalizedPath === '/assignments' ||
                            normalizedPath.startsWith('/assignments/') ||
                            normalizedPath === '/activities' ||
                            normalizedPath.startsWith('/activities/') ||
                            normalizedPath === '/resources' ||
                            normalizedPath.startsWith('/resources/') ||
                            normalizedPath === '/quizzes' ||
                            normalizedPath.startsWith('/quizzes/');
  
  if (usesContentLayout) {
    return null;
  }
  
  return <Footer />;
}

