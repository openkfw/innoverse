'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from 'next-auth/react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { destroyCookie, parseCookies } from 'nookies';

import Collapse from '@mui/material/Collapse';
import useMediaQuery from '@mui/material/useMediaQuery';

import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { errorMessage } from '../common/CustomToast';

import { CredentialsLoginForm, useCredentialsLoginForm } from './CredentialsLoginForm';
import LoginProviderRow from './LoginProviderRow';
import MobileLoginProviderRow from './MobileLoginProviderRow';
import MobileUserSuggestionRow from './MobileUserSuggestionRow';
import UserSuggestionRow from './UserSuggestionRow';

interface SignInOptionsProps {
  providers: string[];
}

export default function SignInOptions({ providers: providersForPage }: SignInOptionsProps) {
  const [signInProviders, setSignInProviders] = useState<ClientSafeProvider[]>([]);
  const [open, setOpen] = useState(false);
  const [userSuggested, setUserSuggested] = useState(true);
  const credentialsLoginForm = useCredentialsLoginForm();

  const { session } = parseCookies();
  const appInsights = useAppInsightsContext();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function getSignInProviders() {
      try {
        const providers = await getProviders();
        if (!providers) {
          handleNoProvider();
        } else {
          const filteredProviders = filterProviders(providers);
          !filteredProviders.length ? handleNoProvider() : setSignInProviders(filteredProviders);
        }
      } catch (error) {
        console.error('Failed to fetch sign-in providers:', error);
        errorMessage({ message: m.components_login_signInOptions_failedSignInError() });
        appInsights.trackException({
          exception: new Error('Failed to fetch sign-in providers', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    }
    getSignInProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNoProvider = () => {
    console.error('No sign-in providers found');
    errorMessage({ message: m.components_login_signInOptions_signInProviderError() });
  };

  const getCookieData = () => {
    try {
      if (!session) throw new Error('Session cookie is not set.');
      const cookieData = JSON.parse(decodeURIComponent(atob(session)));
      return {
        name: cookieData.user.name,
        image: cookieData.user.image,
        provider: cookieData.provider,
      };
    } catch (error) {
      console.error('Failed to parse session cookie:', error);
      errorMessage({ message: m.components_login_signInOptions_sessionInfoError() });
      appInsights.trackException({
        exception: new Error('Failed to retrieve session information.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
      return null;
    }
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

  const filterProviders = (providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>) => {
    const matchingProviders = Object.values(providers).filter((provider) => providersForPage.includes(provider.id));
    return matchingProviders;
  };

  const getProvider = () => {
    if (!signInProviders || !session) return undefined;
    return Object.values(signInProviders).find(
      (provider) => provider.id === getCookieData()?.provider && provider.type !== 'credentials',
    );
  };

  const handleSignIn = (provider: ClientSafeProvider) => {
    if (provider.type === 'credentials') {
      credentialsLoginForm.openForm(provider.id);
    } else {
      signIn(provider.id);
    }
  };

  const loggedInProvider = getProvider();
  const suggestionRowVisible = signInProviders && session && userSuggested && loggedInProvider !== undefined;

  return (
    <>
      {suggestionRowVisible && (
        <>
          {isSmallScreen ? (
            <MobileUserSuggestionRow
              key={loggedInProvider.id}
              provider={loggedInProvider}
              name={getCookieData()?.name}
              image={getCookieData()?.image}
              handleRemoveCookie={handleRemoveCookie}
              handleToggleCollapse={handleToggleCollapse}
              open={open}
            />
          ) : (
            <UserSuggestionRow
              key={loggedInProvider.id}
              provider={loggedInProvider}
              name={getCookieData()?.name}
              image={getCookieData()?.image}
              handleRemoveCookie={handleRemoveCookie}
              handleToggleCollapse={handleToggleCollapse}
              open={open}
            />
          )}
        </>
      )}

      <Collapse
        in={open || !session || (session !== undefined && providersForPage.length === 1) || !suggestionRowVisible}
        unmountOnExit
      >
        {credentialsLoginForm.open && credentialsLoginForm.providerId && (
          <CredentialsLoginForm
            providerId={credentialsLoginForm.providerId}
            onNavigateBack={credentialsLoginForm.closeForm}
          />
        )}
        {!credentialsLoginForm.open &&
          signInProviders &&
          Object.values(signInProviders).map((provider) =>
            isSmallScreen ? (
              <MobileLoginProviderRow key={provider.id} provider={provider} onSignIn={() => handleSignIn(provider)} />
            ) : (
              <LoginProviderRow key={provider.id} provider={provider} onSignIn={() => handleSignIn(provider)} />
            ),
          )}
      </Collapse>
    </>
  );
}
