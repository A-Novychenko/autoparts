'use client';

// import Image from 'next/image';
import Link from 'next/link';

import { TiDelete } from 'react-icons/ti';

import staticData from '@/data/common.json';

import { useCart } from '@/context';
import { cn, currencyFormatted, generateProductPath } from '@/utils';

import { CartItem } from '@/context/CartProvider/types';
import { CartProductsProps } from './types';

export const CartProducts: React.FC<CartProductsProps> = ({
  items,
  isCheckoutPage = false,
  isCheckoutResultPage = false,
  className = '',
}) => {
  const { setQuantity, removeItem } = useCart();

  const { articleLabel } = staticData;

  const increment = (item: CartItem) => {
    setQuantity(item.id, item.quantity + 1);
  };

  const decrement = (item: CartItem) => {
    if (item.quantity > 1) {
      setQuantity(item.id, item.quantity - 1);
    } else {
      // removeItem(item.id); // Видаляємо товар, якщо кількість стає 0
      return;
    }
  };

  return (
    <div className={className}>
      <ul className="flex flex-col gap-2">
        {items &&
          items.map(item => {
            const {
              _id,
              brand,
              id,
              name,
              price,
              price_promo,
              quantity,
              img,
              article,
              availability,
              availabilityLviv,
            } = item;

            const finalPrice = price_promo ? price_promo : price;

            const priceFormatted: string = currencyFormatted(price);
            const finalPriceFormatted: string = currencyFormatted(finalPrice);
            const finalPriceTotalFormatted: string = currencyFormatted(
              finalPrice * quantity,
            );

            const outOfStock = availability === '0' && availabilityLviv === '0';

            return (
              <li
                key={id}
                className={cn(
                  'relative gap-4 overflow-hidden rounded-[16px] border border-solid border-blue-100 text-[16px]/normal shadow-customLight',
                  'smOnly:px-2',
                  'md:flex md:flex-col md:items-center',
                  'xl:flex-row xl:justify-between',
                  { 'border-red bg-red/15': outOfStock },
                  { 'bg-saleBg': price_promo },
                )}
              >
                <Link href={generateProductPath({ name, _id, brand })}>
                  <div className="w-full gap-4 pt-2 md:flex md:flex-col md:items-center xl:flex-row xl:justify-between xl:pt-0">
                    <div className="size-[80px] shrink-0 smOnly:mx-auto">
                      {/* <Image
                        src={img}
                        alt={name}
                        width={100}
                        height={100}
                        className="size-full object-contain"
                      /> */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={name}
                        width={100}
                        height={100}
                        className="size-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <p
                      className={cn('grow text-center  xl:text-left', {
                        'xl:w-[180px]': isCheckoutPage,
                        'xl:w-[340px]': !isCheckoutPage,
                      })}
                    >
                      {name}
                    </p>

                    <div
                      className={cn(
                        'w-[180px] shrink-0 text-center xl:text-left smOnly:w-full',
                        { 'w-[140px]': isCheckoutPage },
                      )}
                    >
                      <p
                        className={cn('mb-2 text-[14px]', {
                          'mb-2 text-[12px]': isCheckoutPage,
                        })}
                      >
                        {articleLabel}&nbsp;{' '}
                        <br className={cn({ hidden: !isCheckoutPage })} />
                        {article}
                      </p>

                      {!isCheckoutResultPage && (
                        <p className="mb-4 overflow-hidden text-ellipsis text-[12px] font-bold uppercase leading-[1.6]">
                          {outOfStock ? (
                            <span className="text-rose-800">
                              Немає в наявності
                            </span>
                          ) : (
                            <span
                              className={cn('text-[14px] text-green-600', {
                                'text-[12px]': isCheckoutPage,
                                'text-green-600': availability !== '0',
                                'text-orange-600':
                                  availability === '0' &&
                                  availabilityLviv !== '0',
                              })}
                            >
                              {' '}
                              {availability !== '0'
                                ? `В наявності ${availability}`
                                : `Під замовлення - ${availabilityLviv}`}
                              шт
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="items-center gap-2 md:flex smOnly:text-center mdOnly:mb-4">
                  <div className="items-center gap-4  text-right md:flex  smOnly:text-center">
                    <div
                      className={cn('xl:w-[100px]', {
                        'flex-col items-end md:flex': price_promo,
                      })}
                    >
                      {price_promo && (
                        <p className="text-[14px] line-through smOnly:mt-4">
                          {priceFormatted}
                        </p>
                      )}

                      <p className="smOnly:mt-4">
                        <span className="smOnly:mb-2 smOnly:inline-block">
                          <span className="inline-block xl:hidden">
                            Ціна:&nbsp;
                          </span>
                          {finalPriceFormatted}
                        </span>
                      </p>
                    </div>

                    {!isCheckoutResultPage && (
                      <div className="flex items-center gap-2 xl:w-[100px] smOnly:justify-center">
                        <button
                          type="button"
                          className="size-8 rounded-md bg-slate-200"
                          onClick={() => {
                            decrement(item);
                          }}
                        >
                          -
                        </button>

                        <p className="inline-flex size-8 items-center justify-center text-center">
                          {quantity}
                        </p>

                        <button
                          type="button"
                          className="size-8 rounded-md bg-slate-200"
                          onClick={() => {
                            increment(item);
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {isCheckoutResultPage && (
                      <p className="inline-flex size-8 w-[100px] items-center justify-center text-center">
                        {quantity}шт
                      </p>
                    )}

                    <p
                      className={cn(
                        'xl:w-[100px] smOnly:my-4 smOnly:font-bold',
                        { 'mr-4': isCheckoutResultPage },
                      )}
                    >
                      <span className="inline-block xl:hidden">
                        Сумма:&nbsp;
                      </span>

                      {finalPriceTotalFormatted}
                    </p>
                  </div>

                  {!isCheckoutResultPage && (
                    <button
                      type="button"
                      className="absolute right-1 top-1 p-2 text-redApple transition-colors hover:text-darkRed focus:text-darkRed xl:static"
                      onClick={() => {
                        removeItem(id);
                      }}
                    >
                      <TiDelete size={24} />
                    </button>
                  )}
                </div>

                <div
                  className={cn(
                    'absolute -top-1 right-0 hidden h-[40px] w-[96px] smOnly:left-1 smOnly:top-2 smOnly:h-[55px] smOnly:w-[120px]',
                    {
                      block: price_promo,
                    },
                  )}
                >
                  {/* <Image
                    src="/images/sale.webp"
                    width={500}
                    height={218}
                    alt="Акція"
                    className="size-full rotate-[10deg] object-contain"
                  /> */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sale.webp"
                    width={500}
                    height={218}
                    alt="Акція"
                    className="size-full rotate-[10deg] object-contain"
                    loading="lazy"
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
