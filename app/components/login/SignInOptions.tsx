'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { getProviders } from 'next-auth/react';
import { destroyCookie, parseCookies } from 'nookies';

import { Collapse } from '@mui/material';

import LoginProviderRow from './LoginProviderRow';
import UserSuggestionRow from './UserSuggestionRow';

export default function SignInOptions() {
  const [signInProviders, setSignInProviders] = useState<any>();
  const [open, setOpen] = React.useState(false);
  const [userSuggested, setUserSuggested] = React.useState(true);
  const { session } = parseCookies();

  useEffect(() => {
    async function getSignInProviders() {
      setSignInProviders(await getProviders());
    }
    getSignInProviders();
  }, []);

  const getCookieData = () => {
    const cookieData = JSON.parse(atob(session));
    return {
      name: cookieData.user.name,
      image: cookieData.user.image,
      provider: cookieData.provider,
    };
  };

  const handleToggleCollapse = () => {
    setOpen(!open);
  };

  const handleRemoveCookie = () => {
    setUserSuggested(false);
    destroyCookie(undefined, 'session', {
      path: '/',
    });
  };

  const getProvider = () => {
    return Object.values(signInProviders).find((provider: any) => provider.id === getCookieData().provider) as {
      name: string;
      id: string;
    };
  };

  return (
    <>
      {signInProviders && session && userSuggested && (
        <UserSuggestionRow
          key={getProvider().id}
          provider={getProvider()}
          name={getCookieData().name}
          image={getCookieData().image}
          handleRemoveCookie={handleRemoveCookie}
          handleToggleCollapse={handleToggleCollapse}
          open={open}
        />
      )}
      <Collapse in={open || !session} unmountOnExit>
        {signInProviders &&
          Object.values(signInProviders).map((provider: any) => (
            <LoginProviderRow key={provider.id} provider={provider} />
          ))}
      </Collapse>
    </>
  );
}
