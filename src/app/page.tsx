"use client";

import useFcmToken from "@/hooks/useFcmToken";
import { useState } from "react";

export default function Home() {
  const { token, notificationPermissionStatus } = useFcmToken();
  const [isLoading, setLoading] = useState(false)

  console.log('Current token:', token);
  console.log('Permission status:', notificationPermissionStatus);

  const handleTestNotification = async () => {
    setLoading(true)
    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        message: "This is a test notification from your Firebase app!",
        link: "/",
      }),
    });

    const data = await response.json();
    console.log({ data });
    setLoading(false)
  };

  return (
    <main className="p-10">
      <h1 className="text-4xl mb-4 font-bold">Firebase Cloud Messaging Demo</h1>

      {notificationPermissionStatus === "granted" ? (
        <p>Permission to receive notifications has been granted.</p>
      ) : notificationPermissionStatus !== null ? (
        <p>
          You have not granted permission to receive notifications. Please
          enable notifications in your browser settings.
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Debug Info:</h3>
          <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'Not generated yet'}</p>
          <p><strong>Permission:</strong> {notificationPermissionStatus || 'Checking...'}</p>
        </div>

        <button
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          onClick={handleTestNotification}
        >
          Send Test Notification
        </button>
      </div>
    </main>
  );
}