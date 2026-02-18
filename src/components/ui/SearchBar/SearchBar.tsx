'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import SearchIcon from '~/icons/search-icon.svg';
import staticData from '@/data/common.json';

export const SearchBar = () => {
  const { defaultTypeGallery } = staticData;
  const { placeholder, ariaLabelBtn, ariaLabelIcon } = staticData.searchInput;

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(
      `/search-products/${defaultTypeGallery}?searchQuery=${encodeURIComponent(searchQuery.trim().toUpperCase())}`,
    );

    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        className="w-full rounded-md py-1 pl-2 pr-7 text-[16px] text-secondaryText xl:w-[400px] xl:p-2 xl:pr-10 xl:text-[20px]"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        id="global-search"
      />

      <button type="submit" aria-label={ariaLabelBtn}>
        <SearchIcon
          width={40}
          height={40}
          className="absolute right-0 top-0 size-[28px] p-1 xl:size-[40px] xl:p-2"
          aria-label={ariaLabelIcon}
        />
      </button>
    </form>
  );
};
