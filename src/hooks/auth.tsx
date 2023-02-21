import axios, { AxiosResponse } from 'axios';
import { useState, useContext, createContext } from 'react';

import { ISafeUser } from '../types/user';

// Context
const AuthContext = createContext(null as any);

// Our hook.
export function useAuth(): {
  user: ISafeUser | null;
  setNewUser: (user: ISafeUser) => void;
  login: (username: string, password: string) => Promise<boolean>;
} {
  return useContext(AuthContext);
}

// Our hook logic.
function useProvideAuth() {
  const [user, setUser] = useState<ISafeUser>();

  function setNewUser(user: ISafeUser) {
    setUser(user);
  }

  async function login(username: string, password: string): Promise<boolean> {
    let response: AxiosResponse<{ user: ISafeUser }>;
    try {
      response = await axios.post('/api/v1/user/login', {
        username,
        password
      });
    } catch (error) {
      return false;
    }
    setNewUser(response.data.user);
    return true;
  }

  return {
    setNewUser,
    user,
    login
  };
}

// The context we provide.
export function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
