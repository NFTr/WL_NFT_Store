import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import './app.css';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Home } from './pages/Home';

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
        path: 'gallery',
        element: <Gallery />,
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
