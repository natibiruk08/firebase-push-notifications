import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function createFirebaseAdminApp() {
    if (getApps().length > 0) {
        return getApps()[0]!;
    }

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        return initializeApp({
            credential: cert(serviceAccount),
        });
    }

    const firebaseAdminConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    return initializeApp({
        credential: cert(firebaseAdminConfig),
    });
}

export function getFirebaseAdminMessaging() {
    const app = createFirebaseAdminApp();
    return getMessaging(app);
}
