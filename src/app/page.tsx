export const revalidate = 3600;

import { VinRequestMainCard } from '@/components/base';
import {
  AboutSection,
  CatalogSection,
  HeroSection,
  PopularProductsSection,
} from '@/sections';
import { GroupSection } from '@/sections/GroupSection/GroupSection';

import { makeHomeStructuredData } from '@/utils';

export default async function HomePage() {
  const structuredData = makeHomeStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <HeroSection />

      <GroupSection />

      <CatalogSection />

      <section className="section xl:hidden">
        <div className="container">
          <VinRequestMainCard />
        </div>
      </section>

      <PopularProductsSection />

      <AboutSection />
    </>
  );
}
