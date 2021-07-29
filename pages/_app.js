import '../styles/globals.css';
import Default from '../layouts/default';
import NProgress from 'nprogress'
import Router from 'next/router';
import {useState} from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Error
const Error = () => {
  return ( <>
    <div className="error-container w-screen h-screen overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-5xl text-center">
        <p className="text-red-400">Error</p>
        <p>
          [<Link href="/">
            <a>Escape</a>
          </Link>]
        </p>
      </div>
    </div>
  </> );
}

// Loading
const Loading = () => {
  return ( <>
    <div className="loading-container w-screen h-screen overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-5xl text-center">
        <p>Searching Archive...</p>
      </div>
    </div>
  </> );
}

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  // Bind Routing Events
  Router.events.on('routeChangeStart', () => {
    setLoading(true);
    NProgress.start();
  });
  Router.events.on('routeChangeComplete', () => {
    setLoading(false);
    NProgress.done();
  });
  Router.events.on('routeChangeError', () => {
    setError(true);
    NProgress.done();
  });

  return (
    <>
    <Default>
      {error ? <Error /> : loading ? <Loading /> : <Component {...pageProps} />}
    </Default>
    </>
  )
}

export default MyApp
