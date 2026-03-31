import styles from '@/components/base/ProductList/ProductList.module.css';

export default function Loading() {
  return (
    // Ставим min-h-screen и bg-mediumBg, чтобы перекрыть темный фон body сразу
    <div className="flex min-h-screen grow flex-col bg-mediumBg">
      {/* СЕКЦИЯ ХЕДЕРА */}
      <section className="pb-1 pt-4 xl:pb-0 xl:pt-5">
        <div className="container">
          <div className="mb-4 flex h-6 items-center justify-between">
            <div className="skeleton-fill h-3 w-32" /> {/* Крошки */}
            <div className="skeleton-fill hidden h-8 w-24 md:block" />
          </div>
          <div className="skeleton-fill my-2 h-8 w-1/2 md:my-5 md:h-12" />{' '}
          {/* Заголовок */}
        </div>
      </section>

      {/* СЕТКА ТОВАРОВ */}
      <section className="section-compact flex grow pb-10">
        <div className="container">
          <ul className="flex flex-col flex-wrap gap-2 md:flex-row smOnly:justify-center">
            {[...Array(8)].map((_, i) => (
              <li key={i} className={styles.gridItem}>
                <div className="flex w-full flex-col items-center overflow-hidden rounded-[8px] border border-transparent bg-lightBg p-0">
                  {/* Контейнер картинки: md:size-[282px] из твоего кода */}
                  <div className="h-[200px] w-full p-2 md:size-[282px]">
                    <div className="skeleton-fill size-full" />
                  </div>

                  {/* Текстовая часть p-4 pt-0 */}
                  <div className="w-full p-4 pt-0 text-[14px]">
                    <div className="flex h-[40px] items-center">
                      <div className="skeleton-fill h-4 w-16" /> {/* Бренд */}
                    </div>
                    <div className="mb-2 flex h-[42px] flex-col gap-2">
                      <div className="skeleton-fill h-4 w-full" />{' '}
                      {/* Имя строка 1 */}
                      <div className="skeleton-fill h-4 w-2/3" />{' '}
                      {/* Имя строка 2 */}
                    </div>
                    <div className="mb-4 flex h-[63px] flex-col gap-2">
                      <div className="skeleton-fill h-3 w-full" />{' '}
                      {/* Описание */}
                      <div className="skeleton-fill h-3 w-full" />
                      <div className="skeleton-fill h-3 w-1/2" />
                    </div>
                    <div className="mb-2 h-[24px]">
                      <div className="skeleton-fill h-4 w-32" /> {/* Артикул */}
                    </div>
                    <div className="mb-1 flex h-8 justify-end">
                      <div className="skeleton-fill h-7 w-24" /> {/* Цена */}
                    </div>
                    <div className="mb-4 flex h-[19px] justify-end">
                      <div className="skeleton-fill h-3 w-28" /> {/* Склад */}
                    </div>
                    <div className="skeleton-fill h-[44px] w-full" />{' '}
                    {/* Кнопка */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
