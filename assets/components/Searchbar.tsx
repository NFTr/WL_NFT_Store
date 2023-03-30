import React, { Fragment, useState } from 'react';
import useSWR from 'swr';
import { Collection } from './Collection';
import { CollectionList } from './CollectionList';
import { List, Grid_K, Grid_G, SearchSVG, DropdownSVG } from './SocialIcons';
import { Menu, Transition } from '@headlessui/react';
import { useSearch } from '../hooks/api';

export const Searchbar: React.FC = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [searchTerm, setSearchTerm] = useState('');

  const { nfts, collections, isLoading } = useSearch(searchTerm);
  const [orderTerm, setOrderTerm] = useState('');
  //   const { data: searchDids, isLoading: isLoadingDids } = useSWR(`/api/dids?search=${searchTerm}`, fetcher);
  const [gridStyle, setGridStyle] = React.useState('grid-compact');
  const [numResultsNFTs, setNumResultsNFTs] = useState(6);
  const [numResultsCollections, setNumResultsCollections] = useState(6);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const orderIdAsc = () => {
    setOrderTerm('&order%5Bid%5D=asc');
  };

  const handleShowMoreNFTs = () => {
    setNumResultsNFTs((prevNumResults) => prevNumResults + 9);
  };
  const handleShowMoreCollections = () => {
    setNumResultsCollections((prevNumResults) => prevNumResults + 9);
  };
  const orders = [
    { set: () => setOrderTerm('&order%5Bid%5D=asc'), label: 'ID ascending' },
    { set: () => setOrderTerm('&order%5Bid%5D=desc'), label: 'ID descending' },
    { set: () => setOrderTerm('&order%5Bname%5D=asc'), label: 'Name ascending' },
    { set: () => setOrderTerm('&order%5Bname%5D=desc'), label: 'Name descending' },
    { set: orderIdAsc, label: 'Price ascending' },
    { set: orderIdAsc, label: 'Price descending' },
  ];

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
                <div>
                  <Menu>
                    {({ open }) => (
                      <>
                        <Menu.Button
                          className="flex items-center rounded-lg bg-white/90 py-2 pl-5 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          Order
                          <div
                            className={
                              open
                                ? 'rotate-180 px-3 transition-transform duration-300 ease-in-out'
                                : 'px-3 transition-transform duration-300 ease-in-out'
                            }
                          >
                            <DropdownSVG></DropdownSVG>
                          </div>
                        </Menu.Button>
                        <Transition
                          show={isOpen}
                          enter="transition duration-200 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <div className="mt-3 flex w-fit rounded-md bg-white/90 px-5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:ring-white/10 ">
                            <Menu.Items>
                              {orders.map((order) => (
                                <Menu.Item key={order.label} as={Fragment}>
                                  {({ active }) => (
                                    <div
                                      onClick={order.set}
                                      className={`${
                                        active
                                          ? 'text-zinc-800 dark:text-zinc-200'
                                          : ' text-zinc-500 dark:text-zinc-400'
                                      }  py-2 text-lg  font-bold `}
                                    >
                                      {order.label}
                                    </div>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </div>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>

                <div className="">
                  <button
                    onClick={() => setGridStyle('list')}
                    className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
                  >
                    <List></List>
                  </button>
                  <button
                    onClick={() => setGridStyle('grid-compact')}
                    className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
                  >
                    <Grid_K></Grid_K>
                  </button>
                  <button
                    onClick={() => setGridStyle('grid')}
                    className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
                  >
                    <Grid_G></Grid_G>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <>
                {nfts?.length > 0 && (
                  <div className="">
                    <div className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-200">Found NFTs</div>
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
                    <div className="mb-4 mt-8 text-2xl font-bold text-zinc-800 dark:text-zinc-200">
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
