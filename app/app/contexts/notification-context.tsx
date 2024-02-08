'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';

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

  useEffect(() => {
    const registerNotifications = async () => {
      if (!hasPushNotificationPermission()) {
        await requestPushNotificationPermission();
      }
      let subscription = await getPushNotificationSubscriptions();
      if (!subscription) {
        subscription = await subscribePushNotification();
      }
      await subscribeToWebPush(JSON.stringify(subscription));
    };

    try {
      if (!initialized.current && user && !isLoading) {
        initialized.current = true;
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register('/sw.js', {
              scope: '/',
            })
            .then(() => {
              registerNotifications().then(() => console.info('Push Notifications registered'));
            });
        }
      }
    } catch (error) {
      console.error("Can't register service worker", error);
    }
  }, [user, isLoading]);

  return <NotificationContext.Provider value={contextObject}> {children}</NotificationContext.Provider>;
};

export const useNotification = () => useContext(NotificationContext);
