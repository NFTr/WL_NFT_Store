import React from 'react';
import useSWR from 'swr';
import { Collection } from '../components/Collection';
import { Container } from '../components/Container';
import { fetcher } from '../utilities/fetcher';

export const Gallery: React.FC = () => {
  let collectionId = 'col1vkehesfftd7j9ae7ufaq42rtry69hckm00tf70tc527jkq42qw6sk0pxpy';
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${collectionId}`, fetcher);

  const {
    data: collectionNfts,
    error: errorNfts,
    isLoading: isLoadingNfts,
  } = useSWR(`/api/collections/${collectionId}/nfts`, fetcher);

  const [gridStyle, setGridStyle] = React.useState('grid-compact');

  const renderHeader = () => (isLoading ? <div>Loading...</div> : <div>{collection.name}</div>);
  const renderGallery = () =>
    isLoadingNfts ? (
      <div>Loading NFTs...</div>
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
        <Collection collectionNfts={collectionNfts} gridStyle={gridStyle} />
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

export const Grid_K = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-black dark:fill-white">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
};

export const Grid_G = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-black dark:fill-white">
      <g transform="matrix(0.636364,0,0,0.636364,1.23864,1.23864)">
        <path d="M3.75,6C3.75,4.766 4.766,3.75 6,3.75L8.25,3.75C9.484,3.75 10.5,4.766 10.5,6L10.5,8.25C10.5,9.484 9.484,10.5 8.25,10.5L6,10.5C4.766,10.5 3.75,9.484 3.75,8.25L3.75,6ZM3.75,15.75C3.75,14.516 4.766,13.5 6,13.5L8.25,13.5C9.484,13.5 10.5,14.516 10.5,15.75L10.5,18C10.5,19.234 9.484,20.25 8.25,20.25L6,20.25C4.766,20.25 3.75,19.234 3.75,18L3.75,15.75ZM13.5,6C13.5,4.766 14.516,3.75 15.75,3.75L18,3.75C19.234,3.75 20.25,4.766 20.25,6L20.25,8.25C20.25,9.484 19.234,10.5 18,10.5L15.75,10.5C14.516,10.5 13.5,9.484 13.5,8.25L13.5,6ZM13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z" />
      </g>
      <g transform="matrix(0.636364,0,0,0.636364,7.48864,1.23864)">
        <path d="M13.5,6C13.5,4.766 14.516,3.75 15.75,3.75L18,3.75C19.234,3.75 20.25,4.766 20.25,6L20.25,8.25C20.25,9.484 19.234,10.5 18,10.5L15.75,10.5C14.516,10.5 13.5,9.484 13.5,8.25L13.5,6ZM13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z" />
      </g>
      <g transform="matrix(0.636364,0,0,0.636364,7.48864,7.48864)">
        <path d="M13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z" />
      </g>
      <g transform="matrix(0.636364,0,0,0.636364,1.23864,7.48864)">
        <path d="M3.75,15.75C3.75,14.516 4.766,13.5 6,13.5L8.25,13.5C9.484,13.5 10.5,14.516 10.5,15.75L10.5,18C10.5,19.234 9.484,20.25 8.25,20.25L6,20.25C4.766,20.25 3.75,19.234 3.75,18L3.75,15.75ZM13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z" />
      </g>
    </svg>
  );
};

export const List = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-black dark:fill-white" viewBox="0 0 16 16">
      <path
        fillRule="evenodd"
        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
};
