import { createGetInitialProps } from '@mantine/next';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

class Document extends NextDocument {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>{/* TODO: All the meta tags. */}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
