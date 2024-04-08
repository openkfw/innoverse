'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Box from '@mui/material/Box';

import { useSessionItem } from '@/app/contexts/helpers';
import { NotificationBanner } from '@/components/notifications/NotificationBanner';
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

// Allows to manually show a notification to the user
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
      <Box
        display={showPushSubscriptionAlert ? 'flex' : 'none'}
        style={{
          justifyContent: 'flex-end',
        }}
      >
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
  const delayBeforeAlertIsDisplayedInSeconds = 5;

  const [alertState, setAlertState] = useState<'askEnablePush' | 'showManualSteps' | 'dismissed'>();
  const hideAlertSessionItem = useSessionItem<boolean>('hide-push-subscription-alert');

  const { user, isLoading } = useUser();
  const initialized = useRef(false);
  const appInsights = useAppInsightsContext();
  const hideAlert = useCallback(
    ({ rememberAfterPageReload }: { rememberAfterPageReload: boolean }) => {
      setAlertState('dismissed');
      if (rememberAfterPageReload) {
        hideAlertSessionItem.set(true);
      }
    },
    [hideAlertSessionItem],
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
      hideAlertSessionItem.set(true);
    } catch (error) {
      handleError(error);
    }
  }, [hideAlertSessionItem]);

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
    [isLoading, user],
  );

  return {
    showPushSubscriptionAlert:
      user && !hideAlertSessionItem.value && alertState !== undefined && alertState !== 'dismissed',
    hidePushSubscriptionAlert: hideAlert,
    registerPushNotifications: registerNotifications,
    showManualSteps: alertState === 'showManualSteps',
  };
}

export const useNotification = () => useContext(NotificationContext);
