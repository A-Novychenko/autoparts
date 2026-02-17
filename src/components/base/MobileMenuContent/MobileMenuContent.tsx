import { Assistance, Contacts, NavLinks, WorkSchedule } from '@/components/ui';

export const MobileMenuContent = () => {
  return (
    <div className="flex h-full flex-col">
      <div
        className="menu-item-animate mb-8"
        style={{ animationDelay: '100ms' }}
      >
        <NavLinks />
      </div>

      <div
        className="menu-item-animate mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animationDelay: '150ms' }}
      />

      <div
        className="menu-item-animate mb-10"
        style={{ animationDelay: '200ms' }}
      >
        <p className="mb-4 pl-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          Підтримка та зв&#x02BC;язок
        </p>

        <Assistance variant="mobile" />
      </div>

      <div className="flex-1" />

      <div
        className="menu-item-animate rounded-[24px] border border-white/5 bg-white/[0.03] p-6"
        style={{ animationDelay: '300ms' }}
      >
        <div className="mb-6">
          <Contacts classNameWrap="gap-5 items-start font-bold text-xl tracking-tight smOnly340:text-[16px]" />
        </div>

        <div className="border-t border-white/10 pt-5">
          <WorkSchedule labelClassName="text-[10px] text-white/30 mb-2 font-bold uppercase tracking-widest" />
        </div>
      </div>

      <div className="h-8 w-full" />
    </div>
  );
};
