import React, { useState } from 'react';
import { useProfileNfts } from '../hooks/api';
import { Collection } from './Collection';
import { GridStyle } from './GridStyle';
import { Order } from './Order';

export const ProfileGallery: React.FC<{ did: any }> = ({ did }) => {
  const [createdOrderTerm, setCreatedOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const [ownedOrderTerm, setOwnedOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const { createdNfts, ownedNfts } = useProfileNfts(did?.id || '', createdOrderTerm, ownedOrderTerm);

  const [createdgridStyle, setCreatedGridStyle] = React.useState('grid-compact');
  const [ownedgridStyle, setOwnedGridStyle] = React.useState('grid-compact');

  const renderCreatedGallery = () =>
    createdNfts?.length === 0 ? (
      <div></div>
    ) : (
      <div>
        <div className="flex justify-center text-2xl font-bold dark:text-white/90">Created NFTs</div>
        <div className="my-2 flex items-start justify-between">
          <Order orderTerm={createdOrderTerm} setOrderTerm={setCreatedOrderTerm}></Order>
          <GridStyle gridStyle={createdgridStyle} setGridStyle={setCreatedGridStyle}></GridStyle>
        </div>
        <Collection collectionNfts={createdNfts} gridStyle={createdgridStyle} />
      </div>
    );

  const renderOwnedGallery = () =>
    ownedNfts?.length === 0 ? (
      <div></div>
    ) : (
      <div>
        <div className="flex justify-center text-4xl font-bold dark:text-white/90">Owned NFTs</div>
        <div className="my-2 flex items-start justify-between">
          <Order orderTerm={ownedOrderTerm} setOrderTerm={setOwnedOrderTerm}></Order>
          <GridStyle gridStyle={ownedgridStyle} setGridStyle={setOwnedGridStyle}></GridStyle>
        </div>
        <Collection collectionNfts={ownedNfts} gridStyle={ownedgridStyle} />
      </div>
    );
  return (
    <>
      <div className="m-10">{renderCreatedGallery()}</div>
      <div className="m-10">{renderOwnedGallery()}</div>
    </>
  );
};
