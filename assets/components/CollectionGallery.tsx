import React, { useState } from 'react';
import { useCollectionNfts, useProfileNfts } from '../hooks/api';
import { Collection } from './Collection';
import { GridStyle } from './GridStyle';
import { Order } from './Order';
import { Search } from './Search';

export const CollectionGallery: React.FC<{ collection: any }> = ({ collection }) => {
  const [orderTerm, setOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const { nfts, isLoading, error, totalPages, size, setSize } = useCollectionNfts(collection.id || '', orderTerm, searchTerm);
  const [gridStyle, setGridStyle] = useState('grid-compact');

  const loadMoreNfts = () => {
    setSize(size + 1);
  };

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <Order orderTerm={orderTerm} setOrderTerm={setOrderTerm}></Order>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
        <GridStyle gridStyle={gridStyle} setGridStyle={setGridStyle}></GridStyle>
      </div>
      <Collection isLoading={isLoading} collectionNfts={nfts} gridStyle={gridStyle} />
      {totalPages && size < totalPages ? (
        <div className="mt-6 flex w-full justify-center">
          <button
            onClick={loadMoreNfts}
            className="rounded-lg bg-white/90 py-2 px-4 text-xl font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 hover:bg-slate-200 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-600"
          >
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
};
