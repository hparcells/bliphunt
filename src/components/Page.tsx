import axios, { AxiosResponse } from 'axios';
import Head from 'next/head';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useAuth } from '../hooks/auth';

import { ISafeUser } from '../types/user';

function Page({ title, children }: { title?: string; children: React.ReactNode }) {
  const auth = useAuth();

  const [cookie, setCookie] = useCookies(['authorization']);

  useEffect(() => {
    (async () => {
      if (cookie.authorization) {
        // Re-Login
        let response: AxiosResponse<{ user: ISafeUser }>;
        try {
          response = await axios.post('/api/v1/user/validate-authorization', {
            authorization: cookie.authorization
          });
        } catch (error) {
          setCookie('authorization', '', { maxAge: 0 });
          return;
        }
        setCookie('authorization', cookie.authorization, { maxAge: 3600 });
        auth.setNewUser(response.data.user);
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <meta property='og:title' content={`${title ? `${title} - ` : ''}Bliphunt`} />

        <title>{`${title ? `${title} - ` : ''}Bliphunt`}</title>
      </Head>
      {children}
    </>
  );
}

export default Page;
