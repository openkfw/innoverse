'use client';
import React from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { parseCookies, setCookie } from 'nookies';

interface CustomSession extends Session {
  provider: string;
}

export const UserContext = ({ children }: { children: React.ReactNode }) => {
  const { data: currentSession } = useSession();
  const { session: sessionCookie } = parseCookies();

  const validCookieExists = () => {
    if (!sessionCookie) return false;
    const cookie = JSON.parse(decodeURIComponent(atob(sessionCookie)));
    const provider = (currentSession as CustomSession)?.provider;

    return JSON.stringify(currentSession?.user) === JSON.stringify(cookie.user) && provider === cookie.provider;
  };

  if (currentSession && !validCookieExists()) {
    setCookie({}, 'session', btoa(encodeURIComponent(JSON.stringify(currentSession))), {
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/', // Cookie is accessible from the root path
      secure: true, // Set to true for HTTPS
      sameSite: 'lax', // Adjust as needed
    });
  }
  return <>{children}</>;
};
