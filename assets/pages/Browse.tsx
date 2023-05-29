import React, { useState } from 'react';
import useSWR from 'swr';
import { Collection } from '../components/Collection';
import { Container } from '../components/Container';
import { ProfileGallery } from '../components/ProfileGallery';
import { useCollection, useCollectionNfts, useProfile } from '../hooks/api';
import { fetcher } from '../utilities/fetcher';

export const Browse: React.FC = () => {
  const [gridStyle, setGridStyle] = React.useState('grid-compact');
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const { data: browseContent, isLoading } = useSWR('/api/browseContent', fetcher);

  const BrowseCollection = ({ collectionId }: { collectionId: string }) => {
    const { collection } = useCollection(collectionId);
    const { nfts, isLoading, error } = useCollectionNfts(collectionId);
    if (error) {
      return <div>Error loading Collection</div>;
    }
    if (!isLoading) {
      setName('Collection ' + collection.name);
    }
    return <Collection isLoading={isLoading} collectionNfts={nfts} gridStyle={gridStyle} />;
  };

  const BrowseProfile = ({ profileId }: { profileId: string }) => {
    const { did, isLoading, error } = useProfile(profileId);

    if (error) {
      return <div>Error loading Profile NFTs</div>;
    }
    if (!isLoading) {
      setId(did.encodedId);
      setName(did.name);
    }
    return <ProfileGallery did={did} />;
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
    <div className="flex flex-col items-center sm:mb-5">
      <div className="text-2xl font-bold dark:text-white/90 lg:text-5xl">{name ? name : id}</div>
      {name ? <div className="max-w-full truncate dark:text-white/90 lg:text-lg">{id}</div> : <div></div>}
    </div>
  );

  return (
    <>
      <Container className="mt-8 sm:mt-16">
        <div>{renderHeader()}</div>
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};
