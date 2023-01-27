import React from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { Container } from '../components/Container';
import { Nft } from '../interfaces/nft';
import {fetcher} from "../utilities/fetcher";

export const Gallery: React.FC = () => {
  let collectionId = 'col1vkehesfftd7j9ae7ufaq42rtry69hckm00tf70tc527jkq42qw6sk0pxpy';
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${collectionId}`, fetcher);

  const {
    data: collectionNfts,
    error: errorNfts,
    isLoading: isLoadingNfts,
  } = useSWR(`/api/collections/${collectionId}/nfts`, fetcher);

  const renderHeader = () => (isLoading ? <div>Loading...</div> : <div>{collection.name}</div>);
  const renderGallery = () =>
    isLoadingNfts ? (
      <div>Loading NFTs...</div>
    ) : (
      <div className="grid grid-cols-3 gap-x-6 gap-y-8">
        {collectionNfts['hydra:member'].map((nft: Nft) => (
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
        ))}
      </div>
    );
  return (
    <>
      <Container className="my-16 sm:mt-32">
        {/*<div>{renderHeader()}</div>*/}
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};
