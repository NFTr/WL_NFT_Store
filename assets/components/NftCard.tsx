import React from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../interfaces/nft';

const NftSkeleton: React.FC<{ gridStyle: string }> = ({ gridStyle }) => {
  if (gridStyle === 'list') {
    return (
      <div className="h-42 flex animate-pulse items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <div className="m-2 h-40 w-40 rounded-xl bg-gray-300"></div>
        <div className="px-5">
          <div className="h-4 w-40 rounded bg-gray-300"></div>
        </div>
        <div className="h-8 w-32 rounded bg-gray-300"></div>
      </div>
    );
  } else if (gridStyle === 'grid') {
    return (
      <div className="flex animate-pulse flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <div className="h-40 w-40 rounded-xl bg-gray-300"></div>
        <div className="mt-2 h-4 w-40 rounded bg-gray-300"></div>
      </div>
    );
  } else {
    return (
      <div className="flex animate-pulse flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <div className="h-40 w-full rounded-t-xl bg-gray-300"></div>
        <div className="flex w-full justify-between px-3 py-4">
          <div className="h-4 w-40 rounded bg-gray-300"></div>
          <div className="h-8 w-32 rounded bg-gray-300"></div>
        </div>
      </div>
    );
  }
};

export const NftCard: React.FC<{ nft?: Nft; gridStyle: string }> = ({ nft, gridStyle }) => {
  if (!nft) {
    return <NftSkeleton gridStyle={gridStyle} />;
  }

  if (gridStyle == 'list') {
    return (
      <Link
        to={`/nfts/${nft.id}`}
        className="h-42 flex items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
      >
        <div>
          <img className="m-2 h-40 w-40 rounded-xl object-cover" src={nft.thumbnailUri} />
        </div>
        <div className="px-5">
          <div className="text-lg font-bold">{nft.name}</div>
        </div>
        <div className="">
          {nft.lowestSellOffer ? (
            <div className="flex items-center">
              <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
              <div>{nft.lowestSellOffer.xchPrice} XCH</div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </Link>
    );
  } else if (gridStyle == 'grid') {
    return (
      <Link
        to={`/nfts/${nft.id}`}
        className="flex flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
      >
        <div className="group">
          <div></div>
          <img className="h-40 w-40 rounded-xl object-cover" src={nft.thumbnailUri} />
          <div className="absolute bottom-0 w-full rounded-b-xl bg-white/70 text-xl transition-all duration-200 group-hover:bg-white/90 group-hover:py-2 group-hover:text-2xl dark:bg-zinc-800/70 dark:text-zinc-200 dark:group-hover:bg-zinc-800/90">
            <div className="text-center text-xs font-bold">{nft.name}</div>
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link
        to={`/nfts/${nft.id}`}
        className="flex flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
      >
        <div>
          <img className="rounded-t-xl" src={nft.thumbnailUri} />
        </div>
        <div className="flex w-full justify-between px-3 py-4">
          <div className="text-lg font-bold">{nft.name}</div>
          <div className="">
            {nft.lowestSellOffer ? (
              <div className="flex items-center">
                <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
                <div>{nft.lowestSellOffer.xchPrice} XCH</div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </Link>
    );
  }
};
