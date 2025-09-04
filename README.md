# Firebase Push Notifications Demo

A complete Next.js 15 application demonstrating Firebase Cloud Messaging (FCM) push notifications with both client-side and server-side implementation.

## 🚀 Features

- **Firebase Cloud Messaging Integration**: Complete FCM setup with client and admin SDK
- **Push Notification API**: Server-side API endpoint for sending notifications
- **Permission Handling**: Automatic notification permission requests
- **Service Worker**: Background message handling with proper service worker setup
- **Foreground Notifications**: Real-time notifications with toast messages
- **Click Actions**: Navigation handling when notifications are clicked
- **TypeScript Support**: Fully typed implementation with best practices
- **Modern UI**: Clean interface with Tailwind CSS and react-hot-toast

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Firebase project with Cloud Messaging enabled
- Firebase service account key (for server-side notifications)

## 🛠️ Environment Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Configure Firebase Client Settings:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project → Project Settings → General
   - Copy your web app configuration values
   - Generate a VAPID key in Cloud Messaging settings

3. **Configure Firebase Admin SDK:**
   - Go to Project Settings → Service Accounts
   - Generate a new private key (downloads a JSON file)
   - Copy the entire JSON content and paste it as `FIREBASE_SERVICE_ACCOUNT_KEY`

See `env.example` for detailed configuration instructions.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```

3. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### POST `/api/send-notification`
Send push notifications to specific devices.

**Request Body:**
```json
{
  "token": "fcm_device_token",
  "title": "Notification Title",
  "message": "Notification message body",
  "link": "/optional-click-url",
  "icon": "/optional-icon-url"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "firebase_message_id",
  "message": "Notification sent successfully"
}
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/send-notification/     # Push notification API endpoint
│   ├── firebase-messaging-sw/    # Service worker route
│   ├── layout.tsx                # Root layout with Toaster
│   └── page.tsx                  # Main demo page
├── hooks/
│   └── useFcmToken.tsx           # FCM token management hook
├── lib/
│   └── firebase-admin.ts         # Firebase Admin SDK configuration
└── firebase.ts                   # Firebase client configuration
```

## 🔧 Firebase Setup Guide

1. **Create Firebase Project:**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one

2. **Enable Cloud Messaging:**
   - Go to Project Settings → Cloud Messaging
   - Generate a VAPID key pair

3. **Create Service Account:**
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Download the JSON file

4. **Configure Domain (Production):**
   - Add your domain to authorized domains in Authentication settings

## 🧪 Testing Notifications

1. **Grant Permissions:** Allow notifications when prompted
2. **Get FCM Token:** The app will automatically generate and display a token
3. **Send Test Notification:** Click the "Send Test Notification" button
4. **Check Results:** Notifications appear as both toast messages and browser notifications

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Store Firebase service account keys securely
- Use environment variables for all sensitive configuration
- Validate notification payloads on the server side

## 📱 Browser Support

- Chrome 50+
- Firefox 44+
- Safari 16+ (with limitations)
- Edge 17+

Note: Push notifications require HTTPS in production.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
