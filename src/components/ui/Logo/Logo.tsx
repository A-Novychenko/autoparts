import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/utils';

export const Logo: React.FC<{
  isMobHeader?: boolean;
  hideBottomLogo?: boolean;
}> = ({ isMobHeader, hideBottomLogo }) => {
  return (
    <Link href="/" className="flex flex-col  items-center">
      <div
        className={cn(
          { 'size-[38px]': isMobHeader && !hideBottomLogo },
          { 'size-[44px]': hideBottomLogo && isMobHeader },
          { 'size-[80px]': !isMobHeader },
        )}
      >
        <Image
          priority
          src="/images/logo.png"
          width={1340}
          height={1340}
          alt="Логотип компанії, червона літера А зверху та жовта літера М знизу та нижній надпиc - адреса сайту"
          className="size-full object-cover"
        />
      </div>
      {!hideBottomLogo && (
        <div
          className={cn(
            { 'h-[18px] w-[170px] xl:h-[28px]': isMobHeader },
            {
              'h-[20px] w-[190px] md:h-5 md:w-auto  xl:h-[28px]': !isMobHeader,
            },
          )}
        >
          <Image
            priority
            src="/images/text-logo.png"
            width={727}
            height={77}
            alt="Логотип компанії, повна вебадреса сайту зображена літерами з металевим блиском"
            className="block h-full w-auto object-cover"
          />
        </div>
      )}
    </Link>
  );
};
