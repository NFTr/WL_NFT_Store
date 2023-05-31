import clsx from 'clsx';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { Container } from '../components/Container';

import { TwitterIcon, InstagramIcon, GitHubIcon, LinkedInIcon, DiscordIcon } from '../components/Icons';
import React from 'react';
import { fetcher } from '../utilities/fetcher';

function SocialLink({ className, to, children, icon: Icon }: any) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        to={to}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  );
}

function MailIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  );
}

export function About() {
  const { data: homeData } = useSWR('/api/homeContent', fetcher);

  return (
    <>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <img
                src={homeData?.aboutImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              {homeData?.aboutTitle}
            </h1>
            <div className="mt-6 space-y-7 whitespace-pre-wrap text-base text-zinc-600 dark:text-zinc-400">
              {homeData?.aboutContent}
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              {homeData?.twitterLink !== '' ? (
                <SocialLink to={homeData?.twitterLink} aria-label="Follow on Twitter" icon={TwitterIcon}>
                  Follow on Twitter
                </SocialLink>
              ) : null}
              {homeData?.discordLink !== '' ? (
                <SocialLink to={homeData?.discordLink} aria-label="Join Discord" icon={DiscordIcon} className="mt-4">
                  Join our Discord
                </SocialLink>
              ) : null}
              {/*<SocialLink*/}
              {/*    href="mailto:spencer@planetaria.tech"*/}
              {/*    icon={MailIcon}*/}
              {/*    className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"*/}
              {/*>*/}
              {/*    spencer@planetaria.tech*/}
              {/*</SocialLink>*/}
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
