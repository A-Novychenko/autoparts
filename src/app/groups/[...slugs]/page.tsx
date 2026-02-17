import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { GroupList, GroupProductsList } from '@/components/base';
import { Breadcrumbs, GallerySwitcher } from '@/components/ui';

import { getGroupBySlugPath, getProductsByGroup } from '@/actions/servicesAPI';
import {
  buildCanonicalPath,
  generateGroupStructuredData,
  getCurrentSlugByGroupPage,
  getGroupSlugs,
  makeGroupPageMetadata,
} from '@/utils';

import staticData from '@/data/common.json';

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://avto-magaz.com.ua';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string[] }>;
}): Promise<Metadata> {
  const { slugs } = await params;
  return makeGroupPageMetadata(slugs);
}

export default async function DynamicCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slugs: string[] }>;
  searchParams: Promise<{ viewMode: GalleryViewMode }>;
}) {
  const { slugs } = await params;

  const [page, groupSlugs] = getGroupSlugs(slugs);
  const currentSlug = getCurrentSlugByGroupPage(groupSlugs);

  const { viewMode } = await searchParams;
  const defaultTypeGallery: GalleryViewMode =
    staticData.defaultTypeGallery as GalleryViewMode;
  const initialViewMode = viewMode || defaultTypeGallery;

  const data = await getGroupBySlugPath(currentSlug);

  if (!data) {
    notFound();
  }

  const { group, isLeaf } = data;

  const dbPath = buildCanonicalPath(group.ancestors, group.slug);
  const urlPath = groupSlugs.join('/');

  if (urlPath !== dbPath) {
    const redirectUrl = `/groups/${dbPath}${page > 1 ? `/page-${page}` : ''}`;
    redirect(redirectUrl);
  }

  const breadcrumbItems: IBreadcrumbItem[] = [];
  let currentPathAccumulator = '';

  if (group.ancestors && group.ancestors.length > 0) {
    ((group.ancestors as IGroupAncestor[]) || []).forEach(ancestor => {
      currentPathAccumulator += `${currentPathAccumulator ? '/' : ''}${ancestor.slug}`;
      breadcrumbItems.push({
        name: ancestor.name,
        slug: currentPathAccumulator,
      });
    });
  }

  breadcrumbItems.push({
    name: group.name,
    slug: dbPath,
  });

  let products = [];
  let totalPages = 1;

  if (isLeaf) {
    try {
      const productsData = await getProductsByGroup(group._id, page);
      if (productsData) {
        products = productsData.products || [];
        totalPages = productsData.totalPages || 1;
      }
    } catch (error) {
      console.error('Error fetching products for SEO:', error);
    }
  }

  const canonicalUrl = `${SITE_URL}/groups/${dbPath}`;
  const structuredData = generateGroupStructuredData(
    group,
    breadcrumbItems,
    canonicalUrl,
    isLeaf,
    products,
  );

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="grow bg-mediumBg">
        <section className="pb-1 pt-4 xl:pb-0 xl:pt-5">
          <div className="container">
            <div className="flex items-center justify-between">
              <Breadcrumbs items={breadcrumbItems} viewMode={viewMode} />

              {isLeaf && <GallerySwitcher viewMode={viewMode} />}
            </div>

            <h1 className="my-2 font-geologica text-[20px] font-bold leading-tight text-secondaryText md:my-5 md:text-[24px] xl:text-[32px]">
              {group.name}
            </h1>
          </div>
        </section>

        {!isLeaf ? (
          <GroupList
            parentId={group._id}
            basePath={`/groups/${currentSlug}`}
            viewMode={initialViewMode}
          />
        ) : (
          <GroupProductsList
            viewMode={initialViewMode}
            slugsPath={dbPath}
            page={page}
            products={products}
            totalPages={totalPages}
          />
        )}

        {group.description && (
          <section className="container py-8">
            <div
              className="prose max-w-none text-secondaryText"
              dangerouslySetInnerHTML={{ __html: group.description }}
            />
          </section>
        )}
      </div>
    </>
  );
}
