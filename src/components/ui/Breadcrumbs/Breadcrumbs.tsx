import Link from 'next/link';
import React from 'react';

import { ChevronIcon, HomeIcon } from './icons';

import { BreadcrumbsProps } from './types';

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  viewMode,
}) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ul className="no-scrollbar flex items-center overflow-x-auto whitespace-nowrap">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 py-2 text-gray-500 transition-colors hover:text-blue-600"
            title="На головну"
          >
            <HomeIcon />
            <span className="text-xs font-medium md:text-sm">Головна</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const slugPath = items
            .slice(0, index + 1)
            .map(i => i.slug)
            .join('/');

          const href = `/groups/${slugPath}`;

          const linkHref = viewMode ? `${href}?viewMode=${viewMode}` : href;

          return (
            <li key={item.slug} className="flex items-center">
              <ChevronIcon />

              {isLast ? (
                <span
                  className="max-w-[150px] truncate text-xs font-semibold text-darkBlueText md:max-w-none md:text-sm"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={linkHref}
                  className="py-2 text-xs font-medium text-gray-500 transition-all hover:text-blue-600 hover:underline md:text-sm"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
