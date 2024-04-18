'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { useLocalStorage } from 'usehooks-ts';

import Box from '@mui/material/Box';

import { NotificationBanner } from '@/components/notifications/NotificationBanner';
import theme from '@/styles/theme';
import { subscribeToWebPush } from '@/utils/notification/pushNotification';

import { useUser } from './user-context';

interface NotificationContextInterface {
  showNotification: (title: string, options: NotificationOptions | undefined) => Promise<Notification>;
}

export const hasPushNotificationPermission = () => {
  return Notification.permission === 'granted';
};

export const requestPushNotificationPermission = async () => {
  return await Notification.requestPermission();
};

export const getPushNotificationSubscriptions = async () => {
  return await navigator.serviceWorker.ready.then(async (registration) => {
    return await registration.pushManager.getSubscription();
  });
};

export const requestPushNotificationPermissionsIfNotPresent = async () => {
  if (hasPushNotificationPermission()) {
    return { permitted: true };
  }

  const permissions = await requestPushNotificationPermission();
  return { permitted: permissions !== 'denied' };
};

export const subscribePushNotification = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });
  return subscription;
};

export const unsubscribePushNotification = async () => {
  const subscription = await getPushNotificationSubscriptions();
  if (subscription) {
    await subscription.unsubscribe();
  }
  return subscription;
};

export const showNotification = async (title: string, options: NotificationOptions | undefined) => {
  if (!('Notification' in window)) {
    throw new Error('Notification not supported');
  }
  if (window.Notification.permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
  return new window.Notification(title, options);
};

const contextObject: NotificationContextInterface = {
  showNotification,
};

const NotificationContext = createContext(contextObject);

export const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { showPushSubscriptionAlert, hidePushSubscriptionAlert, registerPushNotifications, showManualSteps } =
    useNotificationContextProvider();

  return (
    <NotificationContext.Provider value={contextObject}>
      <Box display={showPushSubscriptionAlert ? 'flex' : 'none'} sx={notificationBoxStyles}>
        <NotificationBanner
          showManualSteps={showManualSteps}
          registerPushNotifications={registerPushNotifications}
          hidePushSubscriptionAlert={hidePushSubscriptionAlert}
        />
      </Box>
      {children}
    </NotificationContext.Provider>
  );
};

function useNotificationContextProvider() {
  interface AlertSessionItem {
    hide: boolean;
    userAction: 'dismissed' | 'enabled' | 'not-set';
  }
  const delayBeforeAlertIsDisplayedInSeconds = 5;

  const [alertState, setAlertState] = useState<'askEnablePush' | 'showManualSteps' | 'dismissed'>();

  const [alertSessionItem, setAlertSessionItem] = useLocalStorage<AlertSessionItem>('hide-push-subscription-alert', {
    hide: false,
    userAction: 'not-set',
  });

  const { user, isLoading } = useUser();
  const initialized = useRef(false);
  const appInsights = useAppInsightsContext();
  const hideAlert = useCallback(
    ({ rememberAfterPageReload }: { rememberAfterPageReload: boolean }) => {
      setAlertState('dismissed');
      if (rememberAfterPageReload) {
        setAlertSessionItem({ hide: true, userAction: 'dismissed' });
      }
    },
    [setAlertSessionItem],
  );

  const registerNotifications = useCallback(async () => {
    const handleError = (error?: unknown) => {
      const reason = error ? 'exception occurred' : 'not permitted';
      const message = `Failed to enable push notifications (reason: ${reason})`;

      if (error) {
        console.error(message, error);
        appInsights.trackException({
          exception: new Error(message, { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      } else {
        console.info(message);
      }

      setAlertState('showManualSteps');
    };

    try {
      console.log('Enabling push notifications ...');

      setAlertState('dismissed');
      const promptResult = await requestPushNotificationPermissionsIfNotPresent();

      if (!promptResult.permitted) {
        handleError();
        return;
      }

      let subscription = await getPushNotificationSubscriptions();

      if (!subscription) {
        subscription = await subscribePushNotification();
      }

      await subscribeToWebPush(JSON.stringify(subscription));

      console.info('Enabled push notifications');
      setAlertSessionItem({ hide: true, userAction: 'enabled' });
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertSessionItem.hide]);

  const registerServiceWorker = () => navigator.serviceWorker.register('/sw.js', { scope: '/' });

  useEffect(function onFirstLoadDisplayAlertAfterDelay() {
    const isFirstLoad = alertState === undefined;
    if (isFirstLoad) {
      const timeoutId = setTimeout(() => {
        setAlertState('askEnablePush');
      }, delayBeforeAlertIsDisplayedInSeconds * 1000);
      return () => clearTimeout(timeoutId);
    }
  });

  useEffect(
    function initializeServiceWorker() {
      try {
        if (initialized.current || isLoading || !user) return;

        initialized.current = true;
        if (!('serviceWorker' in navigator)) return;

        registerServiceWorker().then(() => console.log('Service worker registered'));
      } catch (error) {
        console.error("Can't register service worker", error);
        appInsights.trackException({
          exception: new Error('Unable to register service worker', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, user],
  );

  return {
    showPushSubscriptionAlert: user && !alertSessionItem.hide && alertState !== undefined && alertState !== 'dismissed',
    hidePushSubscriptionAlert: hideAlert,
    registerPushNotifications: registerNotifications,
    showManualSteps: alertState === 'showManualSteps',
  };
}

export const useNotification = () => useContext(NotificationContext);

// Notification Context Styles
const notificationBoxStyles = {
  justifyContent: 'flex-end',

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
};
