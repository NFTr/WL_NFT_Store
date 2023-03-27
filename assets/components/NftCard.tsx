import React from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../interfaces/nft';
import useSWR from 'swr';
import { fetcher } from '../utilities/fetcher';

export const NftCard: React.FC<{ nft: Nft; gridStyle: string }> = ({ nft, gridStyle }) => {
  const { data: offers, error: offerError, isLoading: isLoadingOffer } = useSWR(`/api/nfts/${nft.id}/offers`, fetcher);
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
          {offers ? (
            offers['hydra:member'].map((offer: any) => (
              <div className="flex items-center">
                <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
                <div>{offer.requested[0].amount} XCH</div>
              </div>
            ))
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
        <div>
          <div></div>
          <img className="h-40 w-40 rounded-xl object-cover" src={nft.thumbnailUri} />
          <div className="absolute bottom-0 w-full rounded-b-xl bg-white/70 transition-all duration-200 hover:bg-white/90 hover:py-2 hover:text-xl">
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
            {offers ? (
              offers['hydra:member'].map((offer: any) => (
                <div className="flex items-center">
                  <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
                  <div>{offer.requested[0].amount} XCH</div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </Link>
    );
  }
};
