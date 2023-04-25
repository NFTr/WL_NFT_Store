import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { connect, useGoby } from '../components/Goby';
import { Searchbar } from '../components/Searchbar';

export const About: React.FC = () => {
  const { goby, connect } = useGoby();
  return (
    <>
      <Container className="mt-16 sm:mt-32">
        <h1 className="text-zinc-800 dark:text-zinc-100">About</h1>
        <Link className="text-zinc-800 dark:text-zinc-100" to="/">
          Go back{' '}
        </Link>
        <button onClick={() => connect()}>Use Goby</button>
        <button onClick={() => useGoby().requestAccounts()}>Request Accounts</button>
        <button onClick={() => useGoby().takeOffer({ offer: 'offer', fee: 0 })}>Take Offer</button>
        <button onClick={() => connect()}> Connect </button>
        <Searchbar />
      </Container>
    </>
  );
};
