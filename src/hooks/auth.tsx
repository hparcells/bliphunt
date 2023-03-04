import axios, { AxiosResponse } from 'axios';
import { useState, useContext, createContext } from 'react';
import { useCookies } from 'react-cookie';

import { ISafeUser } from '../types/user';

// Context
const AuthContext = createContext(null as any);

// Our hook.
export function useAuth(): {
  user: ISafeUser | null;
  setNewUser: (user: ISafeUser) => void;
  login: (email: string, password: string) => Promise<ISafeUser | null>;
  logOut: () => void;
} {
  return useContext(AuthContext);
}

// Our hook logic.
function useProvideAuth() {
  const [cookie, setCookie] = useCookies(['authorization']);

  const [user, setUser] = useState<ISafeUser | null>(null);

  function setNewUser(user: ISafeUser) {
    setUser(user);
  }

  async function login(email: string, password: string): Promise<ISafeUser | null> {
    let response: AxiosResponse<{ user: ISafeUser }>;
    try {
      response = await axios.post('/api/v1/user/login', {
        email,
        password
      });
    } catch (error) {
      return null;
    }

    const fetchedUser = response.data.user;
    setUser(fetchedUser);
    return fetchedUser;
  }

  function logOut() {
    setUser(null);
    setCookie('authorization', '', { maxAge: 0 });
  }

  return {
    setNewUser,
    user,
    login,
    logOut
  };
}

// The context we provide.
export function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
