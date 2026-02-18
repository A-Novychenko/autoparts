import { MobileMenuContent } from '@/components/base';
import {
  Assistance,
  CartWidget,
  Contacts,
  Logo,
  MobileMenu,
  NavLinks,
  SearchBar,
  WorkSchedule,
} from '@/components/ui';

export const Header: React.FC = () => {
  return (
    <header className=" bg-darkBg text-primaryText">
      <div className="xl:hidden">
        <MobileMenu>
          <MobileMenuContent />
        </MobileMenu>
      </div>

      <div className="container hidden xl:block">
        <div className=" flex flex-col py-1 xl:flex-row xl:items-center xl:justify-between">
          <div className="mt-2 flex justify-between xl:gap-8 smOnly:order-1 smOnly:mb-4 smOnly420:flex-col smOnly420:gap-4">
            <Logo />

            <Contacts classNameWrap="mt-4" />
          </div>

          <div className="items-center gap-2 pt-8 xl:flex xl:flex-col smOnly:order-3">
            <SearchBar />

            <Assistance />
          </div>

          <div className="flex items-center justify-between xl:gap-12 smOnly:order-2 smOnly:mb-4">
            <WorkSchedule />

            <CartWidget />
          </div>
        </div>

        <NavLinks />
      </div>
    </header>
  );
};
