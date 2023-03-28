import React from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../interfaces/nft';
import { NftCard } from './NftCard';

export const Collection: React.FC<{ collectionNfts: any; gridStyle: string; limit?: number }> = ({
  collectionNfts,
  gridStyle,
  limit,
}) => {
  const nftsToDisplay = limit ? collectionNfts['hydra:member'].slice(0, limit) : collectionNfts['hydra:member'];
  if (gridStyle === 'list') {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        {nftsToDisplay.map((nft: Nft) => (
          <NftCard key={nft.id} nft={nft} gridStyle={gridStyle} />
        ))}
      </div>
    );
  } else {
    const gridClasses =
      gridStyle === 'grid-compact' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-4  sm:grid-cols-4 lg:grid-cols-6';
    return (
      <div className={`grid ${gridClasses} gap-x-6 gap-y-8`}>
        {nftsToDisplay.map((nft: Nft) => (
          <NftCard key={nft.id} nft={nft} gridStyle={gridStyle} />
        ))}
      </div>
    );
  }
};
