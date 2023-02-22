import Link from 'next/link';
import Page from '../../components/Page';

import { useAuth } from '../../hooks/auth';

function FeedPage() {
  const auth = useAuth();

  return (
    <Page title='Feed'>
      <p>Feed</p>
      <Link href='/'>Back to home</Link>
      <p>{JSON.stringify(auth)}</p>
      <button onClick={auth.logOut}>Logout</button>
    </Page>
  );
}

export default FeedPage;
