import { MainBanner, VinRequestMainCard } from '@/components/base';

import { getBannerProducts } from '@/actions/servicesAPI';
import { cn } from '@/utils';

export const HeroSection: React.FC = async () => {
  const res = await getBannerProducts();

  const products = res ? res.products : [];

  return (
    <section className={cn('bg-mediumBg py-4')}>
      <div className="container">
        <div className="justify-between  xl:flex">
          <VinRequestMainCard />

          <MainBanner bannerProducts={products} />
        </div>
      </div>
    </section>
  );
};
