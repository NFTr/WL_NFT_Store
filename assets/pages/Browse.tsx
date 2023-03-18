import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { fetcher } from '../utilities/fetcher';
import useSWR from 'swr';
import { TwitterSvg, WebsiteSvg, Grid_G, Grid_K, List } from '../components/SocialIcons';
import { Collection } from '../components/Collection';

export const Browse: React.FC = () => {
  const [gridStyle, setGridStyle] = React.useState('grid-compact');

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const renderGallery = () => {
    const { data: browseContent, isLoading } = useSWR('/api/browseContent', fetcher);

    const {
      data: collectionNfts,
      error: errorNfts,
      isLoading: isLoadingNfts,
    } = useSWR(`/api/collections/${browseContent}/nfts`, fetcher);

    const {
      data: createdNfts,
      error: createderrorNfts,
      isLoading: isLoadingCreatedNfts,
    } = useSWR(`/api/dids/${browseContent}/created_nfts`, fetcher);

    const {
      data: ownedNfts,
      error: ownederrorNfts,
      isLoading: isLoadingOwnedNfts,
    } = useSWR(`/api/dids/${browseContent}/owned_nfts`, fetcher);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (browseContent && browseContent.startsWith('col') && collectionNfts) {
      return <Collection collectionNfts={collectionNfts} gridStyle={gridStyle} />;
    } else if (browseContent && createdNfts) {
      return (
        <div>
          {createdNfts['hydra:totalItems'] === 0 ? (
            <div></div>
          ) : (
            <div>
              <div className="mb-8 flex justify-center text-4xl font-bold dark:text-white/90">Created NFTs</div>
              <Collection collectionNfts={createdNfts} gridStyle={gridStyle} />
            </div>
          )}

          {ownedNfts['hydra:totalItems'] === 0 ? (
            <div></div>
          ) : (
            <div>
              <div className="mb-8 flex justify-center text-4xl font-bold dark:text-white/90">Owned NFTs</div>
              <Collection collectionNfts={ownedNfts} gridStyle={gridStyle} />
            </div>
          )}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const renderHeader = () => (
    <div>
      <div className="mb-8 flex justify-center text-6xl font-bold dark:text-white/90">Browse</div>
      <div className="mb-2 flex justify-end">
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
  );

  return (
    <>
      <Container className="mt-16 sm:mt-32">
        <div>{renderHeader()}</div>
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};
