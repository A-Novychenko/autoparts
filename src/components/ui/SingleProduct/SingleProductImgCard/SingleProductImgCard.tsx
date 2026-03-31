import React from 'react';

export interface SingleProductImgCardProps {
  url: string;
  name: string;
  index?: number; // Порядковый номер (0, 1, 2...)
  total?: number; // Общее количество
  priority?: boolean;
  isFallback?: boolean;
}

export const SingleProductImgCard = ({
  url,
  name,
  index = 0,
  total = 1,
  priority = false,
  isFallback = false,
}: SingleProductImgCardProps) => {
  // 1. Базовое название
  let altText = `${name} — фото товара`;

  // 2. Если это заглушка
  if (isFallback) {
    altText = `Зображення ${name} тимчасово відсутнє (встановлено заглушку)`;
  }
  // 3. Если картинок несколько — добавляем порядковый номер (1, 2, 3...)
  else if (total > 1) {
    altText = `${name} — фото товара №${index + 1}`;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={altText}
      title={altText}
      className="size-full object-contain p-4"
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' } : {})}
    />
  );
};
