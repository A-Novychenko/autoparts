'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion, Variants } from 'framer-motion';

import { Logo, CartWidget, SearchBar } from '@/components/ui';

import { FiMenu } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';

import { MobileMenuProps } from './types';

export const MobileMenu: React.FC<MobileMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Проверяем, был ли клик по ссылке или элементу внутри ссылки (например, иконке)
    if (target.closest('a')) {
      setIsOpen(false);
    }
  };

  const sidebarVariants: Variants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const backdropVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-darkBg py-2 shadow-sm xl:hidden">
        <div className="container">
          <div className="mb-1 flex h-14 items-center justify-between">
            <button
              type="button"
              className="group flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10 active:scale-95"
              onClick={handleToggleMenu}
              aria-label="Open menu"
            >
              <FiMenu size={28} />
            </button>

            <Logo isMobHeader />

            <CartWidget isMobHeader />
          </div>

          <SearchBar />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              onClick={closeMenu}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-[320px] flex-col bg-darkBg shadow-2xl ring-1 ring-white/10"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="flex h-20 items-center justify-between border-b border-white/10 px-6"
                onClick={handleContainerClick}
              >
                <Logo isMobHeader />

                <button
                  type="button"
                  onClick={closeMenu}
                  className="group rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <MdClose className="size-8 transition-transform group-hover:rotate-90" />
                </button>
              </div>

              <div
                className="flex-1 overflow-y-auto px-6 py-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onClick={handleContainerClick}
              >
                {children}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
