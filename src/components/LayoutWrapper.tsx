"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const mainElement = document.querySelector('main');
    const htmlElement = document.documentElement;
    
    if (mainElement) {
      // Determine layout type based on pathname
      const isResourcesDetail = pathname.startsWith('/resources/') && pathname !== '/resources';
      const isDetailWithToc = pathname === '/syllabus' || 
                              (pathname.startsWith('/assignments/') && pathname !== '/assignments') ||
                              (pathname.startsWith('/activities/') && pathname !== '/activities');
      const isListPage = pathname === '/' || 
                        pathname === '/assignments' || 
                        pathname === '/activities' || 
                        pathname === '/resources' ||
                        pathname === '/quizzes';
      
      // Apply appropriate data attributes and classes
      // All pages using ContentLayout need html overflow hidden for scrollable containers
      if (isResourcesDetail) {
        mainElement.setAttribute('data-layout', 'resources-detail');
        htmlElement.classList.add('content-layout-page');
      } else if (isDetailWithToc) {
        mainElement.setAttribute('data-layout', 'detail-with-toc');
        htmlElement.classList.add('content-layout-page');
      } else if (isListPage) {
        mainElement.setAttribute('data-layout', 'list');
        htmlElement.classList.add('content-layout-page');
      } else {
        mainElement.removeAttribute('data-layout');
        htmlElement.classList.remove('content-layout-page');
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
