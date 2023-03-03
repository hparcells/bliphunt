import Link from 'next/link';
import Layout from '../components/Layout/Layout';

function IndexPage() {
  return (
    <Layout>
      <p>Initial app.</p>
      <Link href='/feed'>Feed</Link>
    </Layout>
  );
}

export default IndexPage;
