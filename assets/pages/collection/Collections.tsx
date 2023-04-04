import React from 'react';
import useSWR from 'swr';
import { CollectionList } from '../../components/CollectionList';
import { Container } from '../../components/Container';
import { fetcher } from '../../utilities/fetcher';
import { TwitterSvg, WebsiteSvg, Grid_G, Grid_K, List } from '../../components/SocialIcons';
import { GridStyle } from '../../components/GridStyle';

export const Collections: React.FC = () => {
  const { data: collections, error, isLoading } = useSWR(`/api/collections`, fetcher);

  const [gridStyle, setGridStyle] = React.useState('grid-compact');

  const renderGallery = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div>
        <div className="w-100 mb-2 flex justify-end">
          <GridStyle gridStyle={gridStyle} setGridStyle={setGridStyle} />
        </div>
        <CollectionList collections={collections['hydra:member']} gridStyle={gridStyle} />
      </div>
    );
  return (
    <>
      <Container className="my-16 sm:mt-32">
        {/*<div>{renderHeader()}</div>*/}
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};
