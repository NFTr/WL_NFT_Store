import React, { useState } from 'react';
import useSWR from 'swr';
import { Collection } from '../components/Collection';
import { Container } from '../components/Container';
import { Grid_G, Grid_K, List } from '../components/Icons';
import { useCollection, useProfile } from '../hooks/api';
import { fetcher } from '../utilities/fetcher';

export const Browse: React.FC = () => {
  const [gridStyle, setGridStyle] = React.useState('grid-compact');
  const [name, setName] = useState('');

  const { data: browseContent, isLoading } = useSWR('/api/browseContent', fetcher);

  const BrowseCollection = ({ collectionId }: { collectionId: string }) => {
    const { collection, nfts, isLoading, error } = useCollection(collectionId);
    if (error) {
      return <div>Error loading Collection</div>;
    }
    if (!isLoading) {
      setName('Collection ' + collection.name);
    }
    return <Collection isLoading={isLoading} collectionNfts={nfts} gridStyle={gridStyle} />;
  };

  const BrowseProfile = ({ profileId }: { profileId: string }) => {
    const { did, createdNfts, error, isLoading } = useProfile(profileId);

    if (error) {
      return <div>Error loading Profile NFTs</div>;
    }
    if (!isLoading) {
      if (did.name != 'undefined') {
        setName(`Profile ${did.encodedId.substring(0, 20)}...`);
      } else {
        setName(`Profile ${did.name}`);
      }
    }
    return <Collection isLoading={isLoading} collectionNfts={createdNfts} gridStyle={gridStyle} />;
  };

  const renderGallery = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    let content = <div>Fail</div>;

    if (browseContent.collections.length === 0) {
      content = <BrowseProfile profileId={browseContent.profiles[0]} />;
    } else {
      content = <BrowseCollection collectionId={browseContent.collections[0]} />;
    }

    return content;
  };

  const renderHeader = () => (
    <div>
      <div className="mb-8 flex justify-center text-3xl font-bold dark:text-white/90">{name}</div>
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
