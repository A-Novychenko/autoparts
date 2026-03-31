'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Loader } from '@/components/ui';

const GlobalLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Сброс лоадера при завершении навигации
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor &&
        anchor.href &&
        anchor.href !== window.location.href &&
        !anchor.target &&
        anchor.origin === window.location.origin
      ) {
        // Очищаем старый таймер, если он был
        if (timerRef.current) clearTimeout(timerRef.current);

        // Устанавливаем задержку 400мс
        // Если за это время страница не загрузится (не сменится URL), покажем лоадер
        timerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 400);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-[1px] duration-500">
      <div className="flex flex-col items-center gap-4">
        <Loader />
      </div>
    </div>
  );
};

export default GlobalLoader;
