'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

function LoginPage() {
  const router = useRouter();

  const [cookie, setCookie] = useCookies(['authentication']);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [disabled, setDisabled] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    (async () => {
      if (cookie.authentication) {
        setDisabled(true);
        try {
          await axios.post('/api/user/validate-authentication', {
            authentication: cookie.authentication
          });
        } catch (error) {
          setDisabled(false);
          setIncorrect(true);
          setCookie('authentication', '', { maxAge: 0 });
          return;
        }
        router.push('/feed');
        setDisabled(false);
      }
    })();
  }, []);
  useEffect(() => {
    setIncorrect(false);
  }, [username, password]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    (async () => {
      setIncorrect(false);
      setDisabled(true);
      if (password) {
        let authenticated;
        try {
          authenticated = await axios.post('/api/user/login', {
            username,
            password
          });
        } catch (error) {
          setDisabled(false);
          setIncorrect(true);
          return;
        }
        setCookie('authentication', `${username}@${authenticated.data.apiKey}`, { maxAge: 3600 });
        router.push('/feed');
      }
      setDisabled(false);
    })();
  }

  return (
    <>
      <p>Login</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => {
            return setUsername(e.target.value);
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
    </>
  );
}

export default LoginPage;
