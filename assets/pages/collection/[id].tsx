import React from 'react';
import { useParams } from 'react-router';
import { CollectionGallery } from '../../components/CollectionGallery';
import { Container } from '../../components/Container';
import { TwitterSvg, WebsiteSvg } from '../../components/Icons';
import { useCollection } from '../../hooks/api';

export const CollectionPage: React.FC = () => {
  const { id } = useParams();
  const { collection } = useCollection(id || '');

  const getAttributeValue = (type: string): string | undefined => {
    return collection?.attributes.find((attributes: { type: string }) => attributes.type === type)?.value;
  };

  const bannerUrl = getAttributeValue('banner');
  const iconUrl = getAttributeValue('icon');
  const description = getAttributeValue('description');
  const website = getAttributeValue('website');
  const twitter = getAttributeValue('twitter');
  const twitterLink = twitter ? `https://twitter.com/${twitter}` : undefined;

  const renderHeader = () => (
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

        <div className="w-full -translate-x-10 dark:text-white/90 sm:w-8/12 sm:translate-x-0" id="grid">
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

  return (
    <>
      <Container className="my-8">
        <div className="">{renderHeader()}</div>
        {collection && <CollectionGallery collection={collection} />}
      </Container>
    </>
  );
};
