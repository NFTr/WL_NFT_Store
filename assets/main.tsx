import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import './app.css';
import { About } from './pages/About';
import { CollectionPage } from './pages/collection/[id]';
import { CollectionsPage } from './pages/collection';
import { Gallery } from './pages/Gallery';
import { Home } from './pages/Home';
import { NftPage } from './pages/nfts/[id]';
import { DIDPage } from './pages/profiles/[id]';
import { Browse } from './pages/Browse';
import { AddressPage } from './pages/addresses/[id]';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'nfts',
        children: [
          {
            path: ':id',
            element: <NftPage />,
          },
        ],
      },
      {
        path: 'collections',
        element: <CollectionsPage />,
      },
      {
        path: 'collections',
        children: [
          {
            path: ':id',
            element: <CollectionPage />,
          },
        ],
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'browse',
        element: <Browse />,
      },
      {
        path: 'profiles',
        children: [
          {
            path: ':id',
            element: <DIDPage />,
          },
        ],
      },
      {
        path: 'addresses',
        children: [
          {
            path: ':id',
            element: <AddressPage />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
