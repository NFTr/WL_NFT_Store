import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Container } from '../../components/Container';
import { ProfileGallery } from '../../components/ProfileGallery';
import { useProfile } from '../../hooks/api';

export const DIDPage: React.FC = () => {
  const { id } = useParams();
  const [createdOrderTerm, setCreatedOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const [ownedOrderTerm, setOwnedOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const { did, isLoading } = useProfile(id || '');

  const name = did?.name === null ? did?.encodedId : did?.name;
  const encodedId = did?.encodedId;
  const hasName = did?.name != null;

  const renderHeader = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className="flex flex-col items-center sm:mb-5">
        <div className="text-2xl font-bold dark:text-white/90">{hasName ? name : encodedId}</div>
        {hasName ? <div className="text-lg dark:text-white/90">{encodedId}</div> : <div></div>}
      </div>
    );
  return (
    <>
      <Container className="my-8">
        <div className="">{renderHeader()}</div>
        {id && <ProfileGallery did={did} />}
      </Container>
    </>
  );
};
