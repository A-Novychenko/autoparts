import Link from 'next/link';
import Image from 'next/image';

import { getSubCategories } from '@/actions/servicesAPI';

import { GroupListProps } from './types';

export const GroupList: React.FC<GroupListProps> = async ({
  parentId,
  basePath,
  viewMode,
}) => {
  const groups: IGroup[] = await getSubCategories(parentId);

  if (!groups || groups.length === 0) return null;

  return (
    <section className="section-compact">
      <div className="container">
        <h2 className="visually-hidden">Каталог підкатегорій товарів</h2>

        <ul className="lg:grid-cols-4 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
          {groups.map(group => {
            const href =
              `${basePath}/${group.slug}?viewMode=${viewMode}`.replace(
                /\/+/g,
                '/',
              );

            return (
              <li key={group._id} className="group flex">
                <Link
                  href={href}
                  className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:z-10 hover:border-blue-500 hover:shadow-xl active:scale-95"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden p-4">
                    {group.img ? (
                      <Image
                        src={group.img}
                        alt={group.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-gray-300">
                        <svg
                          className="size-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex grow items-center justify-center p-3 sm:p-5">
                    <h3 className="line-clamp-2 text-center text-[13px] font-bold leading-[1.3] text-gray-900 transition-colors group-hover:text-blue-600 sm:text-base">
                      {group.name}
                    </h3>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
