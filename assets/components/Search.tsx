import React from 'react';
import { SearchSVG } from './Icons';

export const Search: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void }> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="hidden w-1/2 items-center rounded-full bg-white/90 text-zinc-800 shadow-sm shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 md:flex">
      <div className="px-4">
        <SearchSVG></SearchSVG>
      </div>
      <input
        className="w-full rounded-r-full bg-white/90 py-2 pr-2 text-lg leading-tight text-zinc-800 focus:outline-none dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
        type="text"
        placeholder={'Search'}
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};
