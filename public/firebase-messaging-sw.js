importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

fetch("/api/firebase-config")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    console.log("Initializing Firebase with config:", firebaseConfig);

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
      console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
      );

      const notificationTitle =
        payload.notification?.title || "Background Message Title";
      const notificationOptions = {
        body: payload.notification?.body || "Background Message body.",
        icon: "/vercel.png",
        data: payload.data,
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });

    self.addEventListener("notificationclick", function (event) {
      console.log("[firebase-messaging-sw.js] Notification click received.");

      event.notification.close();

      event.waitUntil(
        clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then(function (clientList) {
            const url = event.notification.data.url;

            if (!url) return;

            for (const client of clientList) {
              if (client.url === url && "focus" in client) {
                return client.focus();
              }
            }

            if (clients.openWindow) {
              console.log("OPEN WINDOW ON CLIENT");
              return clients.openWindow(url);
            }
          })
      );
    });
  })
  .catch((error) => {
    console.error("Failed to load Firebase configuration:", error);
  });
