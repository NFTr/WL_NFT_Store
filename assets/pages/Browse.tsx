import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { CollectionGallery } from '../components/CollectionGallery';
import { Container } from '../components/Container';
import { ProfileGallery } from '../components/ProfileGallery';
import { useCollection, useCollectionNfts, useProfile } from '../hooks/api';
import { fetcher } from '../utilities/fetcher';

export const Browse: React.FC = () => {
  const { data: browseContent, isLoading } = useSWR('/api/browseContent', fetcher);

  const BrowseCollection = ({ collectionId }: { collectionId: string }) => {
    const { collection, error } = useCollection(collectionId);

    if (error) {
      return <div>Error loading collection</div>;
    }

    return (
      <div>
        {renderHeader(collectionId, `/collections/${collectionId}`, collection?.name)}
        {collection && <CollectionGallery collection={collection} />}
      </div>
    );
  };

  const BrowseProfile = ({ profileId }: { profileId: string }) => {
    const { did, error } = useProfile(profileId);

    if (error) {
      return <div>Error loading Profile</div>;
    }

    return (
      <div>
        {renderHeader(did?.encodedId, `/profiles/${did?.id}`, did?.name)}
        {did && <ProfileGallery did={did} />}
      </div>
    );
  };

  const renderGallery = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="flex flex-col gap-4 divide-y dark:divide-slate-700">
        {[
          ...browseContent.collections.map((collectionId: string) => (
            <BrowseCollection key={collectionId} collectionId={collectionId} />
          )),
          ...browseContent.profiles.map((profileId: string) => <BrowseProfile key={profileId} profileId={profileId} />),
        ].map((row) => (
          <div className="py-4">{row}</div>
        ))}
      </div>
    );
  };

  const renderHeader = (id: string, to: string, name?: string) => (
    <Link
      to={to}
      className="flex flex-col items-center hover:text-slate-800 dark:text-white/90 dark:hover:text-slate-200/90 sm:mb-5"
    >
      <div className="text-2xl font-bold  lg:text-5xl">{name ? name : 'Unnamed'}</div>
      {<div className="max-w-full truncate lg:text-lg">{id}</div>}
    </Link>
  );

  return (
    <>
      <Container className="my-8 sm:my-16">
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};
