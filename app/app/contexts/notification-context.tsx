'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

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
          registerPushNotifications={() => registerPushNotifications()}
          hidePushSubscriptionAlert={() => hidePushSubscriptionAlert()}
        />
      </Box>
      {children}
    </NotificationContext.Provider>
  );
};

function useNotificationContextProvider() {
  const [manualSteps, setShowManualSteps] = useState(false);
  const enableAlertSessionItem = useSessionItem<boolean>('enable-push-subscription-alert');

  const initialized = useRef(false);
  const { user, isLoading } = useUser();

  const showAlert = useCallback(() => {
    enableAlertSessionItem.set(true);
  }, []);

  const hideAlert = useCallback(() => {
    enableAlertSessionItem.set(false);
  }, [enableAlertSessionItem]);

  const handleError = useCallback(
    ({ triggeredByUserGesture, error }: { triggeredByUserGesture: boolean; error?: unknown }) => {
      const reason = error ? 'exception occurred' : 'not permitted';
      const message = `Failed to enable push notifications (reason: ${reason}, triggered by user gesture: ${triggeredByUserGesture})`;

      if (error) {
        console.error(message, error);
      } else {
        console.info(message);
      }

      if (triggeredByUserGesture) {
        setShowManualSteps(true);
      } else {
        showAlert();
      }
    },
    [showAlert],
  );

  const registerNotifications = useCallback(
    async ({ triggeredByUserGesture }: { triggeredByUserGesture: boolean }) => {
      try {
        const promptResult = await requestPushNotificationPermissionsIfNotPresent();

        if (!promptResult.permitted) {
          handleError({ triggeredByUserGesture });
          return;
        }

        let subscription = await getPushNotificationSubscriptions();

        if (!subscription) {
          subscription = await subscribePushNotification();
        }

        await subscribeToWebPush(JSON.stringify(subscription));

        console.info(`Enabled push notifications (triggered by user gesture: ${triggeredByUserGesture})`);
        hideAlert();
      } catch (error) {
        handleError({ triggeredByUserGesture, error });
      }
    },
    [hideAlert, handleError],
  );

  const requestPushNotificationPermissionsIfNotPresent = async () => {
    if (hasPushNotificationPermission()) {
      return { permitted: true };
    }

    const permissions = await requestPushNotificationPermission();
    return { permitted: permissions !== 'denied' };
  };

  const registerServiceWorker = () => navigator.serviceWorker.register('/sw.js', { scope: '/' });

  useEffect(() => {
    const trigger = setTimeout(() => {
      showAlert();
    }, 5 * 1000);
    return () => clearTimeout(trigger);
  }, []);

  useEffect(
    function initializeServiceWorker() {
      try {
        if (initialized.current || isLoading || !user) return;

        initialized.current = true;
        if (!('serviceWorker' in navigator)) return;

        registerServiceWorker().then(() => console.log('Service worker registered'));
      } catch (error) {
        console.error("Can't register service worker", error);
      }
    },
    [user, isLoading, enableAlertSessionItem.value, registerNotifications],
  );

  return {
    showPushSubscriptionAlert: user && enableAlertSessionItem.value,
    hidePushSubscriptionAlert: () => hideAlert(),
    registerPushNotifications: () => registerNotifications({ triggeredByUserGesture: true }),
    showManualSteps: manualSteps,
  };
}

export const useNotification = () => useContext(NotificationContext);
