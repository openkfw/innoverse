'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { parseCookies, setCookie } from 'nookies';

import { UserSession } from '@/common/types';

interface CustomSession extends Session {
  provider: string;
}

interface UserContextInterface {
  user: UserSession | undefined;
  isLoading: boolean;
}

const defaultState: UserContextInterface = {
  user: undefined,
  isLoading: true,
};

const UserContext = createContext(defaultState);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(defaultState.user);
  const [isLoading, setIsLoading] = useState<boolean>(defaultState.isLoading);

  const { data: currentSession } = useSession();
  const { session: sessionCookie } = parseCookies();

  useEffect(() => {
    const validCookieExists = () => {
      if (!sessionCookie) return false;
      const cookie = JSON.parse(decodeURIComponent(atob(sessionCookie)));
      const provider = (currentSession as CustomSession)?.provider;

      return JSON.stringify(currentSession?.user) === JSON.stringify(cookie.user) && provider === cookie.provider;
    };

    const setUserCookie = () => {
      if (currentSession && !validCookieExists()) {
        setCookie({}, 'session', btoa(encodeURIComponent(JSON.stringify(currentSession))), {
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/', // Cookie is accessible from the root path
          secure: true, // Set to true for HTTPS
          sameSite: 'lax', // Adjust as needed
        });
      }
    };
    setUserCookie();

    if (currentSession) {
      setState(currentSession?.user as UserSession);
      setIsLoading(false);
      return;
    } else {
      setState(undefined);
      setIsLoading(false);
    }
  }, [currentSession, sessionCookie]);

  const contextObject: UserContextInterface = {
    user: state,
    isLoading,
  };

  return <UserContext.Provider value={contextObject}> {children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
