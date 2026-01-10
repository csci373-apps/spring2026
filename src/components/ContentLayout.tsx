"use client";

import { ReactNode } from 'react';
import TableOfContents from './TableOfContents';

interface ResourcePage {
  slug: string;
  title: string;
  group: string;
  group_order: number;
  order: number;
}

interface ContentLayoutProps {
  children: ReactNode;
  variant: 'resources-detail' | 'detail-with-toc' | 'list';
  leftNav?: ReactNode; // For resources detail pages
  showToc?: boolean;
  tocMaxLevel?: number;
  resourcePages?: ResourcePage[]; // For resources detail pages
}

/**
 * Shared layout component that ensures consistent content positioning across all pages.
 * 
 * Layout variants:
 * - resources-detail: Left nav (256px) + Content + TOC (256px fixed right)
 * - detail-with-toc: Spacer (256px) + Content + TOC (256px fixed right)
 * - list: Spacer (256px) + Content (no TOC)
 * 
 * All content starts at 256px from the left to maintain consistent positioning.
 */
export default function ContentLayout({
  children,
  variant,
  leftNav,
  showToc = true,
  tocMaxLevel = 2,
  resourcePages,
}: ContentLayoutProps) {
  const isResourcesDetail = variant === 'resources-detail';
  const isDetailWithToc = variant === 'detail-with-toc';
  const isList = variant === 'list';
  
  // All pages use full-height scrollable containers
  const hasToc = (isResourcesDetail || isDetailWithToc) && showToc;
  
  return (
    <div className="relative lg:h-[calc(100vh-4rem)] lg:overflow-hidden -mx-4 lg:-mx-8">
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden">
        {leftNav && (
          <div className="w-full px-4 pt-4">
            {leftNav}
          </div>
        )}
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-6 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop: Three-column layout with scrollable content */}
      <div className="hidden lg:flex h-full">
        {/* Left Column: Nav (resources or due dates) or Spacer */}
        <div className="w-64 flex-shrink-0">
          {leftNav ? (
            <div className="h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              {leftNav}
            </div>
          ) : (
            // Invisible spacer to align content with pages that have nav
            <div className="h-full" aria-hidden="true" />
          )}
        </div>
        
        {/* Center Column: Content - scrollable on all pages */}
        <div 
          id="main-content-scroll"
          className={`flex-1 min-w-0 overflow-y-auto ${hasToc ? 'mr-72' : ''}`}
        >
          <div className="max-w-4xl px-4 lg:px-8">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column: Table of Contents (fixed, flush to right edge) */}
      {(isResourcesDetail || isDetailWithToc) && showToc && (
        <div className="hidden lg:block fixed top-16 right-0 w-72 h-[calc(100vh-4rem)] overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black pr-1 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-black">
          <TableOfContents maxLevel={tocMaxLevel} />
        </div>
      )}
    </div>
  );
}

