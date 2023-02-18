'use client';

import { CookiesProvider } from 'react-cookie';

import '../styles/global.scss';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body>
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}

export default Layout;
