import React from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../interfaces/nft';

export const NftCard: React.FC<{ nft: Nft }> = ({ nft }) => {
  return (
    <Link
      to={`/nfts/${nft.id}`}
      className="flex flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
    >
      <div>
        <img className="rounded-t-xl" src={nft.thumbnailUri} />
      </div>
      <div className="flex w-full px-3 py-4">
        <div className="text-lg font-bold">{nft.name}</div>
      </div>
    </Link>
  );
};
