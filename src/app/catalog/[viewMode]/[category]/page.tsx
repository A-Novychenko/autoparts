import Link from 'next/link';

import { CategoryList, ProductList } from '@/components/base';
import { Pagination } from '@/components/ui';

import { getCategories, getCategory, getProducts } from '@/actions/servicesAPI';
import { cn, getSlugId, makeCatMetaData, makeCatStructuredData } from '@/utils';

import staticData from '@/data/common.json';

export const revalidate = 3600;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;

  const id = getSlugId(category);
  const categoryData = await getCategory(id);

  return makeCatMetaData({
    categorySlug: category,
    category: categoryData?.name || category, // для TITLE и DESCRIPTION
    categoryData: categoryData
      ? {
          name: categoryData.name,
          img: categoryData.img?.trim() || '',
        }
      : null,
  });
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ viewMode: GalleryViewMode; category: string }>;
}) {
  const { viewMode, category } = await params;

  const defaultTypeGallery: GalleryViewMode =
    staticData.defaultTypeGallery as GalleryViewMode;
  const initialViewMode = viewMode || defaultTypeGallery;

  const id = getSlugId(category);

  const [categories, res] = await Promise.all([
    getCategories(id),
    getCategory(id),
  ]);
  const prevCategoryName = res?.name ? res?.name : '';

  let products = [];
  let totalPages = 1;
  const page = 1;
  if (!categories.length) {
    const res = await getProducts(id, page);

    if (!res) {
      return <div>Помилка завантаження товарів. Спробуйте пізніше.</div>;
    }

    products = res?.products || [];
    totalPages = res?.totalPages || 1;
  }

  const structuredData = makeCatStructuredData({
    category: prevCategoryName || 'Автотовари', // Человеческое имя категории, например "Мастильні матеріали"
    categorySlug: category, // Slug категории из URL, например "mastylni-materialy--1"
  });

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="section bg-mediumBg">
        <div className="container">
          <h1
            className={cn('mb-10 text-[40px]', {
              'visually-hidden': !prevCategoryName,
            })}
          >
            {prevCategoryName ? prevCategoryName : 'Галерея категорій'}
          </h1>

          <Link
            href="/#main-cat"
            className="mb-10 inline-block  rounded-[8px] bg-slate-50 px-4 py-2"
          >
            Перейти до всіх категорій
          </Link>

          {categories.length > 0 ? (
            <CategoryList
              data={categories}
              link={`catalog/${initialViewMode}/${category}`}
              page="1"
            />
          ) : (
            <>
              {products.length && (
                <>
                  <ProductList products={products} viewMode={initialViewMode} />

                  <Pagination
                    totalPages={totalPages}
                    page={page}
                    viewMode={initialViewMode}
                    baseLink={`/catalog/${viewMode}/${category}/${category}`}
                  />
                </>
              )}
              <CategoryList
                data={categories}
                link={`catalog/${initialViewMode}/${category}/${category}`}
                page="1"
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
