'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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
  const initialized = useRef(false);
  const { user, isLoading } = useUser();
  const [showPushSubscriptionAlert, setShowPushSubscriptionAlert] = useState(false);

  const registerNotifications = async () => {
    try {
      if (!hasPushNotificationPermission()) {
        await requestPushNotificationPermission();
      }
      setShowPushSubscriptionAlert(false);
      let subscription = await getPushNotificationSubscriptions();
      if (!subscription) {
        subscription = await subscribePushNotification();
      }
      await subscribeToWebPush(JSON.stringify(subscription));
    } catch (error) {
      setShowPushSubscriptionAlert(false);
    }
  };

  const registerServiceWorker = () => navigator.serviceWorker.register('/sw.js', { scope: '/' });

  useEffect(() => {
    setShowPushSubscriptionAlert(!hasPushNotificationPermission());
  }, []);

  useEffect(() => {
    try {
      if (initialized.current || isLoading || !user) return;
      initialized.current = true;
      if (!('serviceWorker' in navigator)) return;
      registerServiceWorker().then(() => {
        registerNotifications().then(() => console.info('Push Notifications registered'));
      });
    } catch (error) {
      console.error("Can't register service worker", error);
    }
  }, [user, isLoading]);

  return (
    <NotificationContext.Provider value={contextObject}>
      <Box
        hidden={!showPushSubscriptionAlert || !user}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={'#edf7ed'}
      >
        <Alert icon={false} severity="success" style={{ borderRadius: 0 }}>
          Möchtest du Updates zu Projekten erhalten?
          <Button variant={'text'} onClick={registerNotifications}>
            Ja
          </Button>
          <Button variant={'text'} onClick={() => setShowPushSubscriptionAlert(false)}>
            Nein
          </Button>
        </Alert>
      </Box>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
