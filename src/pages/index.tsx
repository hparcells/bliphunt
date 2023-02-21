import Link from 'next/link';
import Page from '../components/Page';

function IndexPage() {
  return (
    <Page>
      <p>Initial app.</p>
      <Link href='/feed'>Feed</Link>
    </Page>
  );
}

export default IndexPage;
