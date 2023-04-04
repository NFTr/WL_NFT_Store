import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Collection } from '../../components/Collection';
import { Container } from '../../components/Container';
import { Grid_G, Grid_K, List } from '../../components/SocialIcons';
import { useProfile } from '../../hooks/api';
import { Order } from '../../components/Order';

export const DIDPage: React.FC = () => {
  const { id } = useParams();
  const [createdOrderTerm, setCreatedOrderTerm] = useState('');
  const [ownedOrderTerm, setOwnedOrderTerm] = useState('');
  const { did, createdNfts, ownedNfts, error, isLoading } = useProfile(id || '', createdOrderTerm, ownedOrderTerm);

  const name = did?.name === null ? did?.encodedId : did?.name;
  const encodedId = did?.encodedId;
  const hasName = did?.name != null;

  const [createdgridStyle, setCreatedGridStyle] = React.useState('grid-compact');
  const [ownedgridStyle, setOwnedGridStyle] = React.useState('grid-compact');

  const renderHeader = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className="sm:mb-5">
        <div className="text-center text-2xl font-bold dark:text-white/90">{hasName ? name : encodedId}</div>
        {hasName ? <div className="text-lg dark:text-white/90">{encodedId}</div> : <div></div>}
      </div>
    );
  const renderCreatedGallery = () =>
    createdNfts?.length === 0 ? (
      <div></div>
    ) : (
      <div>
        <div className="flex justify-center text-4xl font-bold dark:text-white/90">Created NFTs</div>
        <div className=" mb-2 flex items-start justify-between">
          <Order orderTerm={createdOrderTerm} setOrderTerm={setCreatedOrderTerm}></Order>
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
        <Collection isLoading={isLoading} collectionNfts={createdNfts} gridStyle={createdgridStyle} />
      </div>
    );

  const renderOwnedGallery = () =>
    ownedNfts?.length === 0 ? (
      <div></div>
    ) : (
      <div>
        <div className="flex justify-center text-4xl font-bold dark:text-white/90">Owned NFTs</div>
        <div className=" mb-2 flex items-start justify-between">
          <Order orderTerm={ownedOrderTerm} setOrderTerm={setOwnedOrderTerm}></Order>
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
        <Collection isLoading={isLoading} collectionNfts={ownedNfts} gridStyle={ownedgridStyle} />
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
