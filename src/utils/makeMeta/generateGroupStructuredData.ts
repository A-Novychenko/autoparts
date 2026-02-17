import staticData from '@/data/common.json';
import { generateProductPath } from '../generateProductPath';

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://avto-magaz.com.ua';
const STORE_NAME = staticData.storeName;
const { socialsArr, contacts } = staticData;

export const generateGroupStructuredData = (
  group: IGroup,
  breadcrumbs: IBreadcrumbItem[],
  canonicalUrl: string,
  isLeaf: boolean,
  products: IASGProduct[],
) => {
  const description = group.description
    ? group.description.substring(0, 160).replace(/(<([^>]+)>)/gi, '')
    : `Каталог товарів категорії ${group.name} в магазині ${STORE_NAME}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaGraph: any[] = [
    // 1. BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}/#breadcrumb`,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}/groups/${item.slug}`,
      })),
    },
    // Организация
    {
      '@type': 'AutoPartsStore',
      '@id': `${SITE_URL}/#organization`,
      name: STORE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo-black.png`,
        width: '1340',
        height: '1340',
      },
      image: `${SITE_URL}/images/logo-black.png`,
      sameAs: socialsArr,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: contacts.phone.lifecell,
          contactType: 'sales',
          areaServed: 'UA',
          availableLanguage: ['Ukrainian', 'Russian'],
        },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Київ',
        postalCode: '02000',
        addressCountry: 'UA',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '19:00',
        },
      ],
      priceRange: '$$',
    },
    // 3. CollectionPage (Сама страница)
    {
      '@type': 'CollectionPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: group.name,
      description: description,
      image: group.img
        ? {
            '@type': 'ImageObject',
            url: group.img,
            width: 800,
            height: 600,
          }
        : undefined,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: { '@id': `${canonicalUrl}/#breadcrumb` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'uk-UA',
    },
  ];

  // Если это конечная категория и есть товары
  if (isLeaf && products.length > 0) {
    // Добавляем список товаров (ItemList)
    schemaGraph.push({
      '@type': 'ItemList',
      '@id': `${canonicalUrl}/#itemlist`,
      itemListElement: products.map(
        (
          {
            _id,
            name,
            brand,
            img,
            description,
            price,
            count_warehouse_3,
            count_warehouse_4,
          },
          index,
        ) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: name,
            url: generateProductPath({ name, _id, brand }),
            image: img?.[0],
            description: description
              ? description.substring(0, 100)
              : undefined,
            offers: {
              '@type': 'Offer',
              price: price,
              priceCurrency: 'UAH',
              availability:
                count_warehouse_3 === '0' && count_warehouse_4 === '0'
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock',
              itemCondition: 'https://schema.org/NewCondition',
              url: generateProductPath({ name, _id, brand }),
            },
          },
        }),
      ),
    });

    // Связываем CollectionPage с этим списком
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (schemaGraph[2] as any).mainEntity = { '@id': `${canonicalUrl}/#itemlist` };
  } else if (isLeaf) {
    // Fallback, если товаров нет или не загрузились
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (schemaGraph[2] as any).mainEntity = {
      '@type': 'OfferCatalog',
      name: `Пропозиції в категорії ${group.name}`,
      url: canonicalUrl,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemaGraph,
  };
};
