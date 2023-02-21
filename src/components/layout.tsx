import Head from 'next/head';

function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      <Head>
        <meta property='og:title' content={`${title ? `${title} - ` : ''}Bliphunt`} />

        <title>{`${title ? `${title} - ` : ''}Bliphunt`}</title>
      </Head>
      {children}
    </div>
  );
}

export default Layout;
