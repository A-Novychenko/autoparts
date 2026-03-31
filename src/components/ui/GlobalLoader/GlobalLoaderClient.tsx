'use client';

import dynamic from 'next/dynamic';

const GlobalLoader = dynamic(
  () => import('@/components/ui/GlobalLoader/GlobalLoader'),
  { ssr: false },
);

export const GlobalLoaderClient = () => {
  return <GlobalLoader />;
};
