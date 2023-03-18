import React from 'react';
import useSWR from 'swr';
import { CollectionList } from '../../components/CollectionList';
import { Container } from '../../components/Container';
import { fetcher } from '../../utilities/fetcher';
import { TwitterSvg, WebsiteSvg, Grid_G, Grid_K, List} from '../../components/SocialIcons'

export const Collections: React.FC = () => {
  const { data: collection, error, isLoading } = useSWR(`/api/collections`, fetcher);

  const [gridStyle, setGridStyle] = React.useState('grid-compact');

  const renderHeader = () => (isLoading ? <div>Loading...</div> : <div>{collection.name}</div>);
  const renderGallery = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div>
        <div className="w-100 mb-2 flex justify-end">
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
        <CollectionList collections={collection} gridStyle={gridStyle} />
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
