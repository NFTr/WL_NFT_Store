import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Collection } from '../../components/Collection';
import { Container } from '../../components/Container';
import { GridStyle } from '../../components/GridStyle';
import { Order } from '../../components/Order';
import { useAddress, useAddressNFTs } from '../../hooks/api';

export const AddressPage: React.FC = () => {
  const { id } = useParams();
  const [createdOrderTerm, setCreatedOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const [ownedOrderTerm, setOwnedOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const { address, isLoading } = useAddress(id || '');
  const { createdNfts, ownedNfts } = useAddressNFTs(id || '', createdOrderTerm, ownedOrderTerm);

  const encodedAddress = address?.encodedAddress;

  const [createdgridStyle, setCreatedGridStyle] = React.useState('grid-compact');
  const [ownedgridStyle, setOwnedGridStyle] = React.useState('grid-compact');

  const renderHeader = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className="sm:mb-5">
        <div className="text-center text-2xl font-mono tracking-tighter dark:text-white/90">{encodedAddress}</div>
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
          <GridStyle gridStyle={createdgridStyle} setGridStyle={setCreatedGridStyle}></GridStyle>
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
          <GridStyle gridStyle={ownedgridStyle} setGridStyle={setOwnedGridStyle}></GridStyle>
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
