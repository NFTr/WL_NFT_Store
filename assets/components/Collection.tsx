import React from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../interfaces/nft';
import { NftCard } from './NftCard';

export const Collection: React.FC<{ collectionNfts: any; gridStyle: String }> = ({ collectionNfts, gridStyle }) => {
  if (gridStyle === 'grid-compact') {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
        {collectionNfts['hydra:member'].map((nft: Nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    );
  } else if (gridStyle === 'list') {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        {collectionNfts['hydra:member'].map((nft: Nft) => (
          <Link
            to={`/nfts/${nft.id}`}
            className="h-42 grid grid-cols-5 rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
          >
            <div>
              <img className="m-2 h-40 w-40 rounded-xl" src={nft.thumbnailUri} />
            </div>
            <div className="flex w-full px-3 py-4">
              <div className="text-2xl font-bold">{nft.name}</div>
            </div>
          </Link>
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        {collectionNfts['hydra:member'].map((nft: Nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    );
  }
};
