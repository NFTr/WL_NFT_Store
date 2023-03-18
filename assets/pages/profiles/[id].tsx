import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Collection } from '../../components/Collection';
import { Container } from '../../components/Container';
import { fetcher } from '../../utilities/fetcher';
import { TwitterSvg, WebsiteSvg, Grid_G, Grid_K, List } from '../../components/SocialIcons';

export const DIDPage: React.FC = () => {
  const { id } = useParams();
  const { data: did, error, isLoading } = useSWR(`/api/dids/${id}`, fetcher);

  const name = did?.name === null ? did?.encodedId : did?.name;
  const encodedId = did?.encodedId;
  const hasName = did?.name != null;

  const {
    data: createdNfts,
    error: createderrorNfts,
    isLoading: isLoadingCreatedNfts,
  } = useSWR(`/api/dids/${id}/created_nfts`, fetcher);

  const {
    data: ownedNfts,
    error: ownederrorNfts,
    isLoading: isLoadingOwnedNfts,
  } = useSWR(`/api/dids/${id}/owned_nfts`, fetcher);

  const [createdgridStyle, setCreatedGridStyle] = React.useState('grid-compact');
  const [ownedgridStyle, setOwnedGridStyle] = React.useState('grid-compact');

  const renderHeader = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className="sm:mb-5">
        <div className="text-2xl font-bold dark:text-white/90">{hasName ? name : encodedId}</div>
        {hasName ? <div className="text-lg dark:text-white/90">{encodedId}</div> : <div></div>}
      </div>
    );
  const renderCreatedGallery = () =>
    isLoadingCreatedNfts ? (
      <div>Loading NFTs...</div>
    ) : createdNfts['hydra:totalItems'] === 0 ? (
      <div></div>
    ) : (
      <div>
        <div className="flex justify-center text-4xl font-bold dark:text-white/90">Created NFTs</div>
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setCreatedGridStyle('list')}
            className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            <List></List>
          </button>
          <button
            onClick={() => setCreatedGridStyle('grid-compact')}
            className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            <Grid_K></Grid_K>
          </button>
          <button
            onClick={() => setCreatedGridStyle('grid')}
            className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            <Grid_G></Grid_G>
          </button>
        </div>
        <Collection collectionNfts={createdNfts} gridStyle={createdgridStyle} />
      </div>
    );

  const renderOwnedGallery = () =>
    isLoadingOwnedNfts ? (
      <div>Loading NFTs...</div>
    ) : ownedNfts['hydra:totalItems'] === 0 ? (
      <div></div>
    ) : (
      <div>
        <div className="flex justify-center text-4xl font-bold dark:text-white/90">Owned NFTs</div>
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setOwnedGridStyle('list')}
            className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            <List></List>
          </button>
          <button
            onClick={() => setOwnedGridStyle('grid-compact')}
            className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            <Grid_K></Grid_K>
          </button>
          <button
            onClick={() => setOwnedGridStyle('grid')}
            className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            <Grid_G></Grid_G>
          </button>
        </div>
        <Collection collectionNfts={ownedNfts} gridStyle={ownedgridStyle} />
      </div>
    );
  return (
    <>
      <Container className="my-8">
        <div className="">{renderHeader()}</div>
        <div className="m-10">{renderCreatedGallery()}</div>
        <div className="m-10">{renderOwnedGallery()}</div>
      </Container>
    </>
  );
};
