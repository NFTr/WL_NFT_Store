import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';

import { DiscordIcon, TwitterIcon } from '../components/SocialIcons';

const homeData = require('../../config/homeConfig.json');

function SocialLink({ icon: Icon, ...props }: any) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];

  const images = [
    'https://assets.mainnet.mintgarden.io/thumbnails/e49938a641b71a3dead9d309a6f96a6f502b68d2096b4318d7b9a21d0d77633a.png',
    'https://assets.mainnet.mintgarden.io/thumbnails/a45e755bf2b6bf7cd9dd39394db6a286b789ba5b34fff8395453a1a5f6e5c7d0.webp',
    'https://assets.mainnet.mintgarden.io/thumbnails/74c7f4dff57ef1da134bb3e904195e1d6eb33278f9dcb28d1f464665b52cb548.png',
    'https://assets.mainnet.mintgarden.io/thumbnails/944b20b91b985fa30c7215cdefbda66cd0ee450eea609de7f0f80b0297a51de2.png',
    'https://assets.mainnet.mintgarden.io/thumbnails/3029e6ad8405272e8cd0921e67e0a3d194a1687acbe8881f01d6cf155ef94c72.png',
  ];

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {images.map((image, imageIndex) => (
          <div
            key={image}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length]
            )}
          >
            <img
              src={image}
              alt=""
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Home() {
  return (
    <>
      {/*<Head>*/}
      {/*  <title>Spencer Sharp - Software designer, founder, and amateur astronaut</title>*/}
      {/*  <meta*/}
      {/*    name="description"*/}
      {/*    content="I’m Spencer, a software designer and entrepreneur based in New York City. I’m the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms."*/}
      {/*  />*/}
      {/*</Head>*/}
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            {homeData.title}
          </h1>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            {homeData.subtitle}
          </h2>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">{homeData.description}</p>
          <div className="mt-6 flex gap-6">
            {homeData.twitterLink !== '' ? (
              <SocialLink to={homeData.twitterLink} aria-label="Follow on Twitter" icon={TwitterIcon} />
            ) : null}
            {homeData.discordLink !== '' ? (
              <SocialLink to={homeData.discordLink} aria-label="Join Discord" icon={DiscordIcon} />
            ) : null}
          </div>
        </div>
      </Container>
      <Photos />
      {/*<Container className="mt-24 md:mt-28">*/}
      {/*  <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">*/}
      {/*    <div className="flex flex-col gap-16">*/}
      {/*      {articles.map((article) => (*/}
      {/*        <Article key={article.slug} article={article} />*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*    <div className="space-y-10 lg:pl-16 xl:pl-24">*/}
      {/*      <Newsletter />*/}
      {/*      <Resume />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</Container>*/}
    </>
  );
}
