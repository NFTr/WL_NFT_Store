import React from 'react';
import { Nft } from '../interfaces/nft';
import { NftCard } from './NftCard';

export const Collection: React.FC<{
  isLoading?: boolean;
  collectionNfts: any[];
  gridStyle: string;
  limit?: number;
}> = ({ isLoading, collectionNfts, gridStyle, limit }) => {
  const loadingElements = Array.from({ length: limit || 12 }, (_, index) => index);
  const nftsToDisplay = limit && collectionNfts ? collectionNfts.slice(0, limit) : collectionNfts;

  const gridElements = isLoading
    ? loadingElements.map((index) => <NftCard key={index} gridStyle={gridStyle} />)
    : nftsToDisplay.map((nft: Nft) => <NftCard key={nft.id} nft={nft} gridStyle={gridStyle} />);

  if (gridStyle === 'list') {
    return <div className="grid grid-cols-1 gap-x-6 gap-y-8">{gridElements}</div>;
  } else {
    const gridClasses =
      gridStyle === 'grid-compact' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-4  sm:grid-cols-4 lg:grid-cols-6';
    return <div className={`grid ${gridClasses} gap-x-6 gap-y-8`}>{gridElements}</div>;
  }
};
