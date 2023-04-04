import React, { Fragment, useState } from 'react';
import useSWR from 'swr';
import { Collection } from './Collection';
import { CollectionList } from './CollectionList';
import { List, Grid_K, Grid_G, SearchSVG, DropdownSVG } from './SocialIcons';
import { Menu, Transition } from '@headlessui/react';
import { useSearch } from '../hooks/api';
import { Order } from './Order';
import { GridStyle } from './GridStyle';

export const Searchbar: React.FC = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTerm, setOrderTerm] = useState('');
  const { nfts, collections, isLoading } = useSearch(searchTerm + orderTerm);

  //   const { data: searchDids, isLoading: isLoadingDids } = useSWR(`/api/dids?search=${searchTerm}`, fetcher);
  const [gridStyle, setGridStyle] = React.useState('grid-compact');
  const [numResultsNFTs, setNumResultsNFTs] = useState(6);
  const [numResultsCollections, setNumResultsCollections] = useState(6);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleShowMoreNFTs = () => {
    setNumResultsNFTs((prevNumResults) => prevNumResults + 9);
  };
  const handleShowMoreCollections = () => {
    setNumResultsCollections((prevNumResults) => prevNumResults + 9);
  };

  return (
    <div>
      <div>
        <div className="flex items-center rounded-full bg-white/90  text-zinc-800 shadow-sm shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
          <div className="px-4">
            <SearchSVG></SearchSVG>
          </div>
          <input
            className="w-full rounded-r-full bg-white/90 py-2 pr-2 leading-tight text-zinc-800 focus:outline-none dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
            type="text"
            placeholder={'Search'}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {searchTerm === '' ? (
          <div></div>
        ) : (
          <div>
            <div>
              <div className="mt-6 mb-2 flex items-start justify-between">
                <Order orderTerm={orderTerm} setOrderTerm={setOrderTerm}></Order>
                <GridStyle gridStyle={gridStyle} setGridStyle={setGridStyle}></GridStyle>
              </div>
            </div>
            <div>
              <>
                {nfts?.length > 0 && (
                  <div className="">
                    <div className="mb-4 flex justify-center text-3xl font-bold text-zinc-800 dark:text-zinc-200">
                      Found NFTs
                    </div>
                    <Collection collectionNfts={nfts} gridStyle={gridStyle} limit={numResultsNFTs} />
                    {nfts.length > numResultsNFTs ? (
                      <button
                        onClick={handleShowMoreNFTs}
                        className="mx-auto mt-6 flex justify-center rounded-full bg-white/90 px-5 py-2 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
                      >
                        Show more
                      </button>
                    ) : (
                      <div>{}</div>
                    )}
                  </div>
                )}
              </>
              <>
                {collections?.length > 0 && (
                  <div>
                    <div className="mb-4 mt-8 flex justify-center text-3xl font-bold text-zinc-800 dark:text-zinc-200">
                      Found Collections
                    </div>
                    <CollectionList collections={collections} gridStyle={gridStyle} limit={numResultsCollections} />
                    {collections.length > numResultsCollections ? (
                      <button
                        onClick={handleShowMoreCollections}
                        className="mx-auto mt-6 flex justify-center rounded-full bg-white/90 px-5 py-2 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
                      >
                        Show More
                      </button>
                    ) : (
                      <div>{}</div>
                    )}
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
