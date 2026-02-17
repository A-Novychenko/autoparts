'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { RiGalleryView2, RiListCheck2 } from 'react-icons/ri';

import { GallerySwitcherProps } from './types';

export const GallerySwitcher: React.FC<GallerySwitcherProps> = ({
  viewMode,
}) => {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateViewMode = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('viewMode', value);

      router.push(pathname + '?' + params.toString());

      return params.toString();
    },
    [pathname, router, searchParams],
  );

  const handleSetGallery = () => {
    updateViewMode('grid');
  };

  const handleSetList = () => {
    updateViewMode('list');
  };

  return (
    <div className="hidden gap-2 md:flex">
      <button onClick={handleSetGallery}>
        <RiGalleryView2
          size={24}
          color={viewMode === 'grid' ? '#0045CB' : '#969696'}
        />
      </button>

      <button onClick={handleSetList}>
        <RiListCheck2
          size={24}
          color={viewMode === 'list' ? '#0045CB' : '#969696'}
        />
      </button>
    </div>
  );
};
