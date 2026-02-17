import { getMainCategories } from '@/actions/servicesAPI';

import { CategoryList } from '@/components/base';

export const CatalogSection: React.FC = async () => {
  const mainCategories = await getMainCategories();

  return (
    mainCategories && (
      <section className="section" id="main-cat">
        <h2 className="visually-hidden">Каталог. Основні категорії товарів</h2>

        <div className="container">
          {mainCategories && (
            <CategoryList
              data={mainCategories}
              link={'catalog/grid'}
              isMainCategory
            />
          )}
        </div>
      </section>
    )
  );
};
