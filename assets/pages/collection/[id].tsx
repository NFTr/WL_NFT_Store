import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Collection } from '../../components/Collection';
import { Container } from '../../components/Container';
import { fetcher } from '../../utilities/fetcher';
import { TwitterSvg, WebsiteSvg, Grid_G, Grid_K, List} from '../../components/SocialIcons'

export const CollectionPage: React.FC = () => {
  const { id } = useParams();
  //id = 'col1vkehesfftd7j9ae7ufaq42rtry69hckm00tf70tc527jkq42qw6sk0pxpy';
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${id}`, fetcher);

  const {
    data: collectionNfts,
    error: errorNfts,
    isLoading: isLoadingNfts,
  } = useSWR(`/api/collections/${id}/nfts`, fetcher);

  const [gridStyle, setGridStyle] = React.useState('grid-compact');

  const getAttributeValue = (type: string): string | undefined => {
    return collection?.attributes.find((attributes: { type: string }) => attributes.type === type)?.value;
  };

  const bannerUrl = getAttributeValue('banner');
  const iconUrl = getAttributeValue('icon');
  const description = getAttributeValue('description');
  const website = getAttributeValue('website');
  const twitter = getAttributeValue('twitter');
  const twitterLink = twitter ? `https://twitter.com/${twitter}` : undefined;

  const renderHeader = () =>
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className="sm:mb-5">
        <img
          className="flex h-60 w-full rounded-xl bg-center object-cover brightness-105 dark:brightness-95"
          src={bannerUrl}
        />
        <div className="flex sm:ml-10 sm:space-x-8">
          <div className="-translate-y-24 translate-x-4 sm:-translate-y-1/3 sm:translate-x-0">
            <img
              className="h-20 w-20 rounded-xl border-4 border-zinc-50 bg-center object-cover shadow-lg backdrop-blur dark:border-zinc-800 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
              src={iconUrl}
            />
            <div className="xs:hidden mt-6 hidden grid-cols-2 justify-items-center sm:grid">
              {twitter ? (
                <a href={twitterLink} target="_blank">
                  <TwitterSvg></TwitterSvg>
                </a>
              ) : null}
              {website ? (
                <a href={website} target="_blank">
                  <WebsiteSvg></WebsiteSvg>
                </a>
              ) : null}
            </div>
          </div>

          <div className="w-full -translate-x-10 dark:text-white/90 sm:w-8/12 sm:translate-x-0">
            <div className="mt-4 text-5xl font-bold sm:text-4xl lg:text-6xl">{collection?.name}</div>
            <div className="mt-4 text-sm sm:text-sm lg:text-base xl:text-lg">{description}</div>
            <div className="mt-6 grid grid-cols-2 justify-items-center sm:hidden">
              {twitter ? (
                <a href={twitterLink} target="_blank">
                  <TwitterSvg></TwitterSvg>
                </a>
              ) : null}
              {website ? (
                <a href={website} target="_blank">
                  <WebsiteSvg></WebsiteSvg>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  const renderGallery = () =>
    isLoadingNfts ? (
      <div>Loading NFTs...</div>
    ) : (
      <div>
        <div className="mb-2 flex justify-end">
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
      <Container className="my-8">
        <div className="">{renderHeader()}</div>
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};