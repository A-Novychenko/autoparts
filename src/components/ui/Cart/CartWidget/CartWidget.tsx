'use client';

import { useRouter } from 'next/navigation';

import { CartIcon } from '@/components/ui';

import { useCart } from '@/context';

import { cn } from '@/utils';

import staticData from '@/data/common.json';

export const CartWidget: React.FC<{ isMobHeader?: boolean }> = ({
  isMobHeader,
}) => {
  const { alt } = staticData.cart;

  const router = useRouter();

  const { items } = useCart();

  const qty = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={() => router.push('/cart')}
      aria-label={alt}
      className={cn('cursor-pointer border-0 bg-transparent p-2', {
        'flex w-[64px] justify-center': isMobHeader,
      })}
    >
      <span className="relative block">
        <CartIcon
          width={!isMobHeader ? 60 : 40}
          height={!isMobHeader ? 60 : 40}
        />

        <span
          className={cn(
            'absolute left-[18%] top-[-30%] flex size-[32px] items-center justify-center rounded-full bg-slate-500 text-[20px]',
            { 'left-[15%] top-[-20%] size-[24px] text-[14px]': isMobHeader },
            { 'bg-redApple text-primaryText': qty > 0 },
          )}
        >
          {qty}
        </span>
      </span>
    </button>
  );
};
