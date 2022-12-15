import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';

export const About: React.FC = () => (
  <>
    <Container className="mt-16 sm:mt-32">
      <h1 className="text-zinc-800 dark:text-zinc-100">About</h1>
      <Link className="text-zinc-800 dark:text-zinc-100" to="/">
        Go back{' '}
      </Link>
    </Container>
  </>
);
