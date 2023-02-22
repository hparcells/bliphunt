import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { useAuth } from '../../hooks/auth';

import Page from '../../components/Page';

function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [cookie, setCookie] = useCookies(['authorization']);

  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');

  const [disabled, setDisabled] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    if (auth.user) {
      router.push('/feed');

      // Just in case.
      setUsernameEmail('');
      setPassword('');
    }
  }, [auth]);
  useEffect(() => {
    setIncorrect(false);
  }, [usernameEmail, password]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    (async () => {
      setIncorrect(false);
      setDisabled(true);

      if (password) {
        const user = await auth.login(usernameEmail, password);
        if (user) {
          setCookie('authorization', `${user.username}@${user.apiKey}`, {
            maxAge: 3600
          });
          router.push('/feed');
          setDisabled(false);
          return;
        }
        // If we are incorrect.
        setIncorrect(true);
      }
      // Fallback.
      setDisabled(false);
    })();
  }

  return (
    <Page title='Login'>
      <p>Login</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username or Email</label>
        <input
          type='text'
          id='username'
          value={usernameEmail}
          onChange={(e) => {
            return setUsernameEmail(e.target.value);
          }}
          disabled={disabled}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => {
            return setPassword(e.target.value);
          }}
          disabled={disabled}
        />
        <button type='submit'>Login</button>
      </form>
      {incorrect && <p>Incorrect username or password.</p>}
    </Page>
  );
}

export default LoginPage;
