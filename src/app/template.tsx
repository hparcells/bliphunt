'use client';

import { useEffect } from 'react';
import ReactGA from 'react-ga4';

function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('G-J54RYTJPJ2');
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname
      });
    }
  }, []);
  return <>{children}</>;
}

export default Template;
