import { SingleProductClientSideImages } from '../SingleProductClientSideImages';
import { SingleProductImgCard } from '../SingleProductImgCard';

const proxify = (url: string) => `/api/image?url=${encodeURIComponent(url)}`;

export const SingleProductImgBox = ({
  img,
  name,
}: {
  img: string[] | string | null;
  name: string;
}) => {
  const images = Array.isArray(img)
    ? img
    : typeof img === 'string'
      ? [img]
      : [];

  // Случай: Нет фото
  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-gray-100">
        <SingleProductImgCard
          url="/images/no-photo.png"
          name={name}
          priority={true}
          isFallback={true}
        />
      </div>
    );
  }

  const proxiedUrls = images.map(proxify);

  // Случай: 1 фото (Прямой рендер на сервере без слайдера)
  if (proxiedUrls.length === 1) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
        <SingleProductImgCard
          url={proxiedUrls[0]}
          name={name}
          index={0}
          total={1}
          priority={true}
        />
      </div>
    );
  }

  // Случай: Несколько фото (Слайдер)
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
      <SingleProductClientSideImages img={proxiedUrls} name={name} />
    </div>
  );
};
