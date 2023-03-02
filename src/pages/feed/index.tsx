import Link from 'next/link';
import Layout from '../../components/Layout/Layout';

import { useAuth } from '../../hooks/auth';

function FeedPage() {
  const auth = useAuth();

  return (
    <Layout title='Feed'>
      <p>Feed</p>
      <Link href='/'>Back to home</Link>
      <p>{JSON.stringify(auth)}</p>
      <button onClick={auth.logOut}>Logout</button>
    </Layout>
  );
}

export default FeedPage;
