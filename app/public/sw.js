self.addEventListener('push', function (event) {
  const { title, body, icon } = event.data.json();
  const promiseChain = self.registration.showNotification(title || 'New Notification', {
    body,
    icon: icon || `/logo192.png`,
  });
  event.waitUntil(promiseChain);
});

// Update the subscription if it expires
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
self.addEventListener(
  'pushsubscriptionchange',
  (event) => {
    const conv = (val) => btoa(String.fromCharCode.apply(null, new Uint8Array(val)));
    const getPayload = (subscription) => ({
      endpoint: subscription.endpoint,
      publicKey: conv(subscription.getKey('p256dh')),
      authToken: conv(subscription.getKey('auth')),
    });

    const subscription = self.registration.pushManager.subscribe(event.oldSubscription.options).then((subscription) =>
      fetch('/api/notification/update-subscription', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          oldSubscription: getPayload(event.oldSubscription),
          newSubscription: getPayload(subscription),
        }),
      }),
    );
    event.waitUntil(subscription);
  },
  false,
);
