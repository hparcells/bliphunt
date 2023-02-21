import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import Layout from '../../components/Layout';

function FeedPage() {
  const router = useRouter();

  const [feed, setFeed] = useState<any>(null);

  const [cookie, setCookie] = useCookies(['authorization']);

  useEffect(() => {
    (async () => {
      if (cookie.authorization) {
        try {
          const response = await axios.get('/api/v1/feed', {
            headers: {
              Authorization: cookie.authorization
            }
          });
          setFeed(response.data);
        } catch (error) {
          setCookie('authorization', '', { maxAge: 0 });
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    })();
  }, []);

  return (
    <Layout title='Feed'>
      <p>Feed</p>
      <p>{JSON.stringify(feed)}</p>
    </Layout>
  );
}

export default FeedPage;
