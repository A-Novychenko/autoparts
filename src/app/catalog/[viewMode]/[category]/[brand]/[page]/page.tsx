import { notFound } from 'next/navigation';

import { CategoryList, ProductList } from '@/components/base';
import { BackBtn, Pagination } from '@/components/ui';

import { getCategories, getCategory, getProducts } from '@/actions/servicesAPI';
import { getSlugId, makeCatMetaData, makeCatStructuredData } from '@/utils';

import staticData from '@/data/common.json';

export const revalidate = 3600;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    viewMode: GalleryViewMode;
    category: string;
    brand: string;
    page: string;
  }>;
}) => {
  const { category, brand, page } = await params;

  const mainCatId = getSlugId(category);
  const brandId = getSlugId(brand);

  const [mainCat, brandCat] = await Promise.all([
    getCategory(mainCatId),
    getCategory(brandId),
  ]);

  const pageMatch = page.match(/^page-(\d+)$/);
  const pageNumber = pageMatch ? parseInt(pageMatch[1], 10) : 1;

  return makeCatMetaData({
    categorySlug: category,
    category: mainCat?.name || category,
    brand: brandCat?.name || brand,
    brandSlug: brand,
    pageNumber,
    categoryData: brandCat
      ? {
          name: brandCat.name,
          img: brandCat.img?.trim() || '',
        }
      : null,
  });
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    viewMode: GalleryViewMode;
    category: string;
    brand: string;
    page: string;
  }>;
}) {
  const { viewMode, category, brand, page } = await params;

  const defaultTypeGallery: GalleryViewMode =
    staticData.defaultTypeGallery as GalleryViewMode;
  const initialViewMode = viewMode || defaultTypeGallery;

  const mainCatId = getSlugId(category);
  const id = getSlugId(brand);
  const match = page.match(/^page-(\d+)$/);
  const pageNumber = match ? parseInt(match[1], 10) : 1;

  let products = [];
  let categories = [];

  const [res, mainCatRes] = await Promise.all([
    getProducts(id, pageNumber),
    getCategory(mainCatId),
  ]);

  products = res?.products || [];
  const totalPages = res?.totalPages || 1;

  const isProductPage = products.length;
  const categoryName = products[0]?.category;

  const mainCatName = mainCatRes?.name || 'Автотовари';

  const structuredData = makeCatStructuredData({
    category: mainCatName, // Человеческое имя категории, например "Мастильні матеріали"
    categorySlug: category, // Slug категории из URL, например "mastylni-materialy--1"
    brand: categoryName, // Название бренда, например "Castrol"
    brandSlug: brand, // Slug бренда, например "castrol--14"
    pageNumber, // Номер страницы (число)
  });

  if (!isProductPage) {
    categories = await getCategories(id);

    if (!categories.length) {
      return notFound();
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="section flex grow bg-mediumBg">
        <div className="container">
          <h1 className="mb-10 text-[40px]">{categoryName}</h1>

          {products.length ? (
            <div className="flex flex-col">
              <ProductList viewMode={initialViewMode} products={products} />

              <Pagination
                totalPages={totalPages}
                page={pageNumber}
                viewMode={initialViewMode}
                baseLink={`/catalog/${viewMode}/${category}/${brand}`}
              />
            </div>
          ) : (
            <>
              <BackBtn className="mb-10 inline-block  rounded-[8px] bg-slate-50 px-4 py-2" />
              <CategoryList
                data={categories}
                link={`catalog/${initialViewMode}/${category}`}
                page="1"
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
