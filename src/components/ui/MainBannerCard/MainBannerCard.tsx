import Image from 'next/image';

import { BuyBtn } from '@/components/ui';

import { cn } from '@/utils';

import staticData from '@/data/common.json';

// article: '216671';
// banner: false;
// brand: 'ELF';
// category: 'ELF/TOTAL';
// category_id: 16;
// cid: '0359914';
// count_warehouse_3: '>10';
// createdAt: '2024-03-05T20:19:26.443Z';
// description: '';
// id: 337575;
// img: [
//   'https://cdn.online.asg.ua/images/products/0359914/805_805/3_ven_0359914_1692950039.jpg',
// ];
// name: 'EVOLUTION 700 TURBO DIESEL 10W40 1L (x12)';
// price: 271;
// price_promo: null;
// sale: false;
// tecdoc_article: '216671';
// updatedAt: '2025-01-03T11:59:49.939Z';
// _id: '65e77e4e5187d0e82e6b13e7';

export const MainBannerCard: React.FC<IASGProduct> = ({
  id,
  category,
  name,
  description,
  price,
  price_promo,
  count_warehouse_3,
  img,
  article,
}) => {
  const { noImage } = staticData;

  const image = img && img.length > 0 ? img[0] : noImage;

  const cartItem = {
    id,
    name,
    price,
    price_promo,
    quantity: 1,
    img: image,
    article,
    availability: count_warehouse_3,
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'flex size-full h-[480px] flex-col items-center justify-between rounded-2xl bg-lightBg p-4 xl:p-10 smOnly:h-[400px]',
          { 'bg-saleBg': price_promo },
        )}
      >
        <div className="mb-2 h-[150px] xl:h-[250px] smOnly:mb-4 smOnly:mt-10">
          <div className="h-[200px] overflow-hidden rounded-[32px] xl:size-[250px] mdOnly:size-[300px]">
            <Image
              src={image}
              width={300}
              height={250}
              alt={name}
              priority
              className="block size-full shrink-0 object-contain"
              blurDataURL={noImage}
            />
          </div>
        </div>

        <div className="w-full">
          <div>
            <p className="mb-1 line-clamp-1 xl:text-[24px]">{`${category} ${name}`}</p>

            <p className="mb-4 line-clamp-1">{description}</p>

            <p className="mb-2 flex items-center overflow-hidden text-ellipsis text-right text-[12px] font-bold uppercase leading-[1.2]">
              {count_warehouse_3 === '0' ? (
                <span className="text-rose-800">Немає в наявності</span>
              ) : (
                <span className="text-[14px] text-green-500 ">
                  В наявності {count_warehouse_3}шт
                </span>
              )}
            </p>
          </div>

          <div className="mx-auto flex max-w-[500px] items-center justify-end gap-4 ">
            <div className="flex grow justify-center gap-3 smOnly:flex-col smOnly:gap-0">
              {price_promo ? (
                <>
                  <p className="mb-1 text-[18px] text-secondaryText line-through smOnly:text-[14px]">
                    {price} грн
                  </p>
                  <p className="mb-1 text-[28px] font-bold text-red smOnly:w-[100px] smOnly:text-[20px]">
                    {price_promo} грн
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-1 text-[28px] font-bold text-green-700 smOnly:text-[20px]">
                    {price} грн
                  </p>
                </>
              )}
            </div>

            <BuyBtn
              disabled={count_warehouse_3 === '0'}
              cartItem={cartItem}
              className="mx-0"
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'absolute right-0 top-0 hidden h-[99px] w-[225px] smOnly:h-[55px] smOnly:w-[120px]',
          {
            block: price_promo,
          },
        )}
      >
        <Image
          src="/images/sale.webp"
          width={500}
          height={218}
          alt="Акція"
          className="size-full object-contain"
        />
      </div>
    </div>
  );
};
