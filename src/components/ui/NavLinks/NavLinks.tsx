import Link from 'next/link';

import staticData from '@/data/common.json';

import styles from './NavLinks.module.css';

export const NavLinks: React.FC = () => {
  const { navLinks } = staticData;

  return (
    <nav className="w-full">
      <ul className="flex flex-col gap-2 xl:flex-row xl:flex-wrap xl:justify-center xl:gap-[2px] xl:border-white/30">
        {navLinks &&
          navLinks.map(({ name, href }, idx) => (
            <li key={idx} className={styles.gridItem}>
              <Link
                href={`/${href}`}
                className="group flex items-center justify-between rounded-xl bg-white/5 px-5 py-4
                 text-base font-semibold uppercase tracking-wide text-white transition-all
                 hover:bg-white/10 active:scale-[0.98]
                 xl:block xl:w-auto xl:cursor-pointer xl:rounded-[4px] xl:bg-mediumBg/20
                 xl:px-10 xl:py-3 xl:text-center xl:text-[16px] xl:font-bold xl:leading-[19px]
                 xl:tracking-normal xl:hover:scale-y-110
                 xl:hover:bg-mediumBg/20 xl:hover:text-accent xl:focus:scale-y-110 xl:focus:text-accent xl:active:scale-100"
              >
                {name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
