import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactGA from 'react-ga4';

import '../styles/global.scss';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  );
}

export default App;
