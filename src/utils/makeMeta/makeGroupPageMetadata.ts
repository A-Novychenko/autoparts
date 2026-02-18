import { Metadata } from 'next';
import { getGroupBySlugPath } from '@/actions/servicesAPI';
import {
  buildCanonicalPath,
  getCurrentSlugByGroupPage,
  getGroupSlugs,
} from '@/utils';
import staticData from '@/data/common.json';

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://avto-magaz.com.ua';
const STORE_NAME = staticData.storeName;

export const makeGroupPageMetadata = async (
  slugs: string[],
): Promise<Metadata> => {
  const [page, groupSlugs] = getGroupSlugs(slugs);
  const currentSlug = getCurrentSlugByGroupPage(groupSlugs);

  const data = await getGroupBySlugPath(currentSlug);

  if (!data || !data.group) {
    return {
      title: `Сторінку не знайдено | ${STORE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  const { group } = data;
  const pageSuffix = page > 1 ? ` — Сторінка ${page}` : '';

  const cleanPath = buildCanonicalPath(group.ancestors, group.slug);
  const canonicalUrl = `${SITE_URL}/groups/${cleanPath}${page > 1 ? `/page-${page}` : ''}`;

  const defaultImage = `${SITE_URL}/meta/og-image.jpg`;
  const ogImage = group.img || defaultImage;

  const baseDesc = `Замовляйте ${group.name} за вигідними цінами в інтернет-магазині ${STORE_NAME}. ✅ Гарантія якості 🚚 Швидка доставка по Україні (Нова Пошта) 🛒 Великий вибір та відгуки покупців.${pageSuffix}`;
  const description = baseDesc.substring(0, 300);

  return {
    title: `${group.name}${pageSuffix} - ${STORE_NAME} | Купити в Україні: ціна, відгуки, продаж`,
    description,
    keywords: `${group.name}, купити ${group.name}, ціна, відгуки, Україна`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${group.name}${pageSuffix} — ${STORE_NAME}`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${group.name} | Інтернет-магазин ${STORE_NAME}`,
        },
      ],
      type: 'website',
      siteName: STORE_NAME,
      locale: 'uk_UA',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${group.name}${pageSuffix} — ${STORE_NAME}`,
      description,
      images: [ogImage],
    },

    // Дополнительные фишки для поисковиков
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Важно для мобильных браузеров
    appleWebApp: {
      title: 'Avto-magaz',
      statusBarStyle: 'default',
    },

    // Прочие теги
    other: {
      'format-detection': 'telephone=no', // Запрещает Safari автоматически превращать цифры в ссылки
      'geo.region': 'UA', // Указываем регион для локального SEO
    },
  };
};
