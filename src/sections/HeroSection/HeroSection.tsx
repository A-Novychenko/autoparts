import { MainBanner, VinRequestMainCard } from '@/components/base';

import { getBannerProducts } from '@/actions/servicesAPI';
import { cn } from '@/utils';

export const HeroSection: React.FC = async () => {
  const res = await getBannerProducts();

  const products = res ? res?.products : [];

  return (
    <section className={cn('bg-mediumBg py-4')}>
      <div className="container">
        <div className="justify-between xl:flex">
          <div className="hidden xl:block">
            <VinRequestMainCard />
          </div>

          {products && products.length > 0 ? (
            <MainBanner bannerProducts={products} />
          ) : (
            <div className="hidden shrink-0 overflow-hidden rounded-2xl bg-darkBg shadow-customLight xl:block xl:h-[480px] xl:w-[724px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Логотип інтернет-магизину"
                width={1200}
                height={630}
                className="size-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
