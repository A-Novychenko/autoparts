import { ProductList } from '@/components/base';
import { Pagination } from '@/components/ui';

export const revalidate = 0;

export const GroupProductsList: React.FC<{
  viewMode: GalleryViewMode;
  slugsPath: string;
  page: number;
  products: IASGProduct[];
  totalPages: number;
}> = async ({ viewMode, slugsPath, page, products, totalPages }) => {
  return (
    <section className="section-compact flex grow">
      <h2 className="visually-hidden">Каталог. Основні групи товарів</h2>

      <div className="container">
        <div className="flex flex-col">
          <ProductList
            viewMode={viewMode}
            products={products}
            isControlsOff={false}
          />

          <Pagination
            totalPages={totalPages}
            page={page}
            viewMode={viewMode}
            baseLink={`/groups/${slugsPath}`}
          />
        </div>
      </div>
    </section>
  );
};
