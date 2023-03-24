import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { fetcher } from '../utilities/fetcher';
import useSWR from 'swr';
import { TwitterSvg, WebsiteSvg, Grid_G, Grid_K, List } from '../components/SocialIcons';
import { Collection } from '../components/Collection';

export const Browse: React.FC = () => {
  const [gridStyle, setGridStyle] = React.useState('grid-compact');
  const [name, setName] = useState('null');

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: browseContent, isLoading } = useSWR('/api/browseContent', fetcher);

  const BrowseCollection = ({ collectionId }: { collectionId: string }) => {
    const {
      data: collectionNfts,
      error: errorNfts,
      isLoading: isNftsLoading,
    } = useSWR(`/api/collections/${collectionId}/nfts`, fetcher);
    const { data: collection, error, isLoading: isLoadingName } = useSWR(`/api/collections/${collectionId}`, fetcher);

    if (isNftsLoading || isLoadingName) {
      return <div>Loading Collection NFTs...</div>;
    }

    if (errorNfts) {
      return <div>Error loading Collection NFTs</div>;
    }
    setName('Collection ' + collection.name);
    return <Collection collectionNfts={collectionNfts} gridStyle={gridStyle} />;
  };

  const BrowseProfile = ({ profileId }: { profileId: string }) => {
    const {
      data: createdNfts,
      error: createderrorNfts,
      isLoading: isLoadingCreatedNfts,
    } = useSWR(`/api/dids/${profileId}/created_nfts`, fetcher);
    const { data: did, error, isLoading: isLoadingName } = useSWR(`/api/dids/${profileId}`, fetcher);

    if (isLoadingCreatedNfts || isLoadingName) {
      return <div>Loading Profile NFTs...</div>;
    }

    if (createderrorNfts) {
      return <div>Error loading Profile NFTs</div>;
    }
    if (did.name != 'undefined') {
      setName('Profile ' + did.encodedId);
    } else {
      setName('Profile ' + did.name);
    }
    console.log(profileId);
    return <Collection collectionNfts={createdNfts} gridStyle={gridStyle} />;
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
      <div className="mb-8 flex justify-center text-6xl font-bold dark:text-white/90">Browse</div>
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
