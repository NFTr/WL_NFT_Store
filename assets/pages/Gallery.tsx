import React from 'react';
import useSWR from 'swr';
import { Container } from '../components/Container';
import { Nft } from '../interfaces/nft';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

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
      <div className="grid grid-cols-3 gap-4">
        {collectionNfts['hydra:member'].map((nft: Nft) => (
          <div className="flex flex-col items-center rounded-xl border">
            <div>
              <img className="rounded-t-xl" src={nft.thumbnailUri} />
            </div>
            <div className="px-3 py-4 flex w-full">
              <div className="text-lg font-bold text-zinc-800">{nft.name}</div>
            </div>
          </div>
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
