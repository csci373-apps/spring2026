"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ResourcePage {
  slug: string;
  title: string;
  group?: string;
}

interface ResourcesNavProps {
  resourcePages: ResourcePage[];
}

export default function ResourcesNav({ resourcePages }: ResourcesNavProps) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();
  
  // Group pages by their group field
  const groupedPages = resourcePages.reduce((groups, page) => {
    const group = page.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(page);
    return groups;
  }, {} as Record<string, typeof resourcePages>);
  
  const renderNavigation = () => (
    <div className="px-3">
      {Object.entries(groupedPages).map(([groupName, pages]) => (
        <div key={groupName} className="mb-6">
          <h4 className="!text-lg !font-normal !mb-2">
            {groupName}
          </h4>
          <div className="space-y-3">
            {pages.map((page) => {
              const href = `/resources/${page.slug}`;
              const isActive = pathname === href;
              return (
                <div key={page.slug} className="resources-nav-link">
                  <Link
                    href={href}
                    onClick={() => setNavOpen(false)}
                    className={`text-sm font-normal transition-colors !border-0 leading-compact block ${
                      isActive
                        ? '!font-extrabold text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-200'
                        : 'text-gray-500 dark:!text-gray-100 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {page.title}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile: Collapsible accordion navigation */}
      <div className="lg:hidden">
        <button 
          className="w-full p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg mb-4 flex justify-between items-center transition-colors"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="font-medium">Resource Pages</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${navOpen ? 'rotate-180' : ''}`} />
        </button>
        {navOpen && (
          <div className="mb-6">
            <nav className="resources-nav w-full border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              {renderNavigation()}
            </nav>
          </div>
        )}
      </div>
      
      {/* Desktop: Sidebar navigation */}
      <nav className="resources-nav hidden lg:block w-full px-4 py-6">
        {renderNavigation()}
      </nav>
    </>
  );
}
