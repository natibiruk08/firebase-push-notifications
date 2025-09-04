"use client";

import { fetchToken, messaging, registerServiceWorker } from "@/lib/firebase";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MAX_RETRY_ATTEMPTS = 3;
const CONSOLE_STYLE =
  "color: green; background: #c7c7c7; padding: 8px; font-size: 20px";

type NotificationPayload = {
  notification?: {
    title?: string;
    body?: string;
  };
  fcmOptions?: {
    link?: string;
  };
  data?: {
    link?: string;
  };
};

type UseFcmTokenReturn = {
  token: string | null;
  notificationPermissionStatus: NotificationPermission | null;
};

async function getNotificationPermissionAndToken(): Promise<string | null> {
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notifications");
    return null;
  }

  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.info("Notification permission not granted");
  return null;
}

const useFcmToken = (): UseFcmTokenReturn => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = useCallback(async (): Promise<void> => {
    if (isLoading.current) return;

    isLoading.current = true;

    try {
      const fetchedToken = await getNotificationPermissionAndToken();

      if (Notification.permission === "denied") {
        setNotificationPermissionStatus("denied");
        console.info("%cPush Notifications - permission denied", CONSOLE_STYLE);
        return;
      }

      if (!fetchedToken) {
        if (retryLoadToken.current >= MAX_RETRY_ATTEMPTS) {
          console.error(
            "%cPush Notifications - unable to load token after retries",
            CONSOLE_STYLE
          );
          toast.error(
            "Unable to load notification token. Please refresh the page."
          );
          return;
        }

        retryLoadToken.current += 1;
        console.warn(
          `Token retrieval failed. Retry attempt ${retryLoadToken.current}`
        );
        setTimeout(() => loadToken(), 1000 * retryLoadToken.current);
        return;
      }

      setNotificationPermissionStatus(Notification.permission);
      setToken(fetchedToken);
      console.info("FCM token loaded successfully");
    } catch (error) {
      console.error("Error loading FCM token:", error);
      toast.error("Failed to initialize notifications");
    } finally {
      isLoading.current = false;
    }
  }, []);

  useEffect(() => {
    const initializeFirebase = async (): Promise<void> => {
      if ("Notification" in window) {
        try {
          await registerServiceWorker();
          await loadToken();
        } catch (error) {
          console.error("Failed to initialize Firebase:", error);
          toast.error("Failed to initialize push notifications");
        }
      } else {
        console.warn("Notifications not supported in this browser");
      }
    };

    initializeFirebase();
  }, [loadToken]);

  const handleNotificationClick = useCallback(
    (link: string) => {
      router.push(link);
    },
    [router]
  );

  const handleForegroundMessage = useCallback(
    (payload: NotificationPayload) => {
      if (Notification.permission !== "granted") return;

      console.log("Foreground push notification received:", payload);
      const link = payload.fcmOptions?.link || payload.data?.link;
      const title = payload.notification?.title || "New message";
      const body = payload.notification?.body || "You have a new notification";

      if (link) {
        toast.success(`${title}: ${body}`);
      } else {
        toast(`${title}: ${body}`);
      }

      const notification = new Notification(title, {
        body,
        data: link ? { url: link } : undefined,
        icon: "/favicon.ico",
        tag: "fcm-notification",
      });

      notification.onclick = (event) => {
        event.preventDefault();
        notification.close();

        const navigationLinkExists = !!event.target


        if (navigationLinkExists) {
          handleNotificationClick((event.target as any).data.url);
        }
      };
    },
    [handleNotificationClick]
  );

  useEffect(() => {
    if (!token) return;

    let unsubscribe: Unsubscribe | null = null;

    const setupMessageListener = async (): Promise<void> => {
      try {
        console.log(
          `Setting up message listener for token: ${token.substring(0, 20)}...`
        );
        const messagingInstance = await messaging();

        if (!messagingInstance) {
          console.warn("Messaging instance not available");
          return;
        }

        unsubscribe = onMessage(messagingInstance, handleForegroundMessage);
        console.log("Message listener registered successfully");
      } catch (error) {
        console.error("Failed to setup message listener:", error);
      }
    };

    setupMessageListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("Message listener unsubscribed");
      }
    };
  }, [token, handleForegroundMessage]);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
