import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';

import { DiscordIcon, TwitterIcon } from '../components/SocialIcons';

import useSWR from 'swr';
import { fetcher } from '../utilities/fetcher';

function SocialLink({ icon: Icon, ...props }: any) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}

function Photos({ data: homeData }: any) {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];
  const images = homeData?.highlightNfts;

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {images.map((image: string | undefined, imageIndex: number) => (
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
  const { data: homeData } = useSWR('/api/homeContent', fetcher);

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
            {homeData?.homeContent.title}
          </h1>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            {homeData?.homeContent.subtitle}
          </h2>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">{homeData?.homeContent.description}</p>
          <div className="mt-6 flex gap-6">
            {homeData?.homeContent.twitterLink !== '' ? (
              <SocialLink to={homeData?.homeContent.twitterLink} aria-label="Follow on Twitter" icon={TwitterIcon} />
            ) : null}
            {homeData?.homeContent.discordLink !== '' ? (
              <SocialLink to={homeData?.homeContent.discordLink} aria-label="Join Discord" icon={DiscordIcon} />
            ) : null}
          </div>
        </div>
      </Container>
      {homeData?.homeContent.highlightNfts.length > 0 ? <Photos data={homeData?.homeContent} /> : null}
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
