import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactGA from 'react-ga4';

import { ProvideAuth, useAuth } from '../hooks/auth';

import '../styles/global.scss';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Google Analytics
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('G-J54RYTJPJ2');
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <CookiesProvider>
        <ProvideAuth>
          <Component {...pageProps} />
        </ProvideAuth>
      </CookiesProvider>
    </>
  );
}

export default App;
