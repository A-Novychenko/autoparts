import Link from 'next/link';
import Image from 'next/image';

import { getRootGroups } from '@/actions/servicesAPI';
import { cn } from '@/utils';

const ACCENTS = [
  'before:bg-blue-500',
  'before:bg-emerald-500',
  'before:bg-orange-500',
  'before:bg-rose-500',
  'before:bg-amber-500',
  'before:bg-indigo-500',
];

export const GroupSection: React.FC = async () => {
  const rootGroups: IGroup[] = await getRootGroups();

  return (
    <section className="section overflow-hidden" id="main-groups">
      <div className="container">
        <h2 className="sr-only">Популярні категорії товарів</h2>

        <ul className="grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
          {rootGroups.map((group, index) => {
            const accentColor = ACCENTS[index % ACCENTS.length];

            const positionInCycle = index % 6;
            const isWide = positionInCycle === 0 || positionInCycle === 5;

            return (
              <li
                key={group._id}
                className={cn(
                  // ❗ hover только с md
                  'group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-customLight transition-all duration-300 md:hover:-translate-y-1 md:hover:border-gray-200 md:hover:shadow-custom',
                  isWide ? 'col-span-2' : 'col-span-1',
                )}
              >
                <Link
                  href={`/groups/${group.slug}?viewMode=grid`}
                  className="flex h-full flex-col"
                  aria-label={`Перейти в категорію ${group.name}`}
                >
                  {/* ❗ Убрали padding отсюда */}
                  <div
                    className={cn(
                      'relative w-full overflow-hidden',
                      isWide
                        ? 'aspect-[2/1] md:aspect-[2.5/1] xl:aspect-[2.1/1]'
                        : 'aspect-[4/3] md:aspect-[1/1]',
                    )}
                  >
                    {/* ❗ padding перенесен внутрь */}
                    <div className="absolute inset-0 p-4">
                      {group.img ? (
                        <Image
                          src={group.img}
                          alt={group.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="
                            object-contain object-center
                            transition-transform duration-500
                            will-change-transform
                            md:group-hover:scale-[1.03]
                          "
                          priority={index < 4}
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-gray-300">
                          <svg
                            className="size-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto flex grow flex-col justify-center bg-white p-3 md:px-5 md:py-4 xl:justify-end xl:py-0 xl:pb-2">
                    <h3
                      className={cn(
                        'relative pt-2 text-sm font-bold leading-tight text-gray-900 md:text-lg',
                        "before:absolute before:left-0 before:top-0 before:block before:h-1 before:w-8 before:content-[''] md:before:w-10",
                        `${accentColor} before:rounded-full before:opacity-90 before:transition-all before:duration-300 before:group-hover:w-full`,
                      )}
                    >
                      <span className="line-clamp-2">{group.name}</span>
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
