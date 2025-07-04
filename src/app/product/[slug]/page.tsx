export const revalidate = 3600;

import { notFound } from 'next/navigation';

import { CastrolSeoSection, SingleProductSection } from '@/sections';

import { getProductData } from '@/actions/servicesAPI';
import { makeProductMetaData, makeProductStructuredData } from '@/utils';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug }: { slug: string } = await params;

  return makeProductMetaData(slug);
};

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const match = slug.match(/--([a-f0-9]{24})$/i);
  const id = match?.[1];

  if (!id) {
    return notFound();
  }

  let product: IASGProduct | null = null;

  try {
    product = await getProductData(id);
  } catch (error) {
    console.error('Помилка отримання продукту:', error);
  }

  if (!product) {
    return notFound();
  }

  const structuredData = makeProductStructuredData({
    name: product.name,
    brand: product.brand,
    description: product.description,
    image: product.img?.[0] || '/meta/og-image.jpg',
    price: product.price,
    availability: product.count_warehouse_3 !== '0',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="visually-hidden">{product.name}</h1>

      <SingleProductSection product={product} />

      {product.brand.toLowerCase().includes('castrol') && <CastrolSeoSection />}
    </>
  );
}
