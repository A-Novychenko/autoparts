'use client';

import { SingleProductImgCard, Slider, SliderArrow } from '@/components/ui';
import { SingleProductClientSideImagesProps } from './types';

export const SingleProductClientSideImages = ({
  img,
  name,
}: SingleProductClientSideImagesProps) => {
  if (!img || img.length < 1) return null;

  const totalImages = img.length;

  const imgData = img.map((el, idx) => {
    return {
      url: el,
      index: idx, // Передаем порядковый номер
      name,
      total: totalImages,
    };
  });

  if (totalImages === 1) {
    return (
      <SingleProductImgCard
        url={img[0]}
        name={name}
        index={0}
        total={1}
        priority={true}
      />
    );
  }

  return (
    <div className="relative size-full">
      <Slider
        section="single-page"
        slidesData={imgData}
        slideComponent={SingleProductImgCard}
      />

      <SliderArrow
        section="single-page"
        wrapClassName="absolute z-40 w-full -translate-y-1/2 top-1/2"
      />
    </div>
  );
};
