import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

type NotificationRequest = {
    token: string;
    title: string;
    message: string;
    link?: string;
};

export async function POST(request: NextRequest) {
    try {
        const body: NotificationRequest = await request.json();
        const { token, title, message, link } = body;

        if (!token || !title || !message) {
            return NextResponse.json(
                { error: "Missing required fields: token, title, and message" },
                { status: 400 }
            );
        }

        const messaging = getFirebaseAdminMessaging();

        const payload = {
            token,
            notification: {
                title,
                body: message,
                imageUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/vercel-text.png",
            },
            data: {
                ...(link && { link }),
            },
            webpush: {
                fcmOptions: {
                    ...(link && { link }),
                },
            },
        } satisfies Message;

        const response = await messaging.send(payload);

        return NextResponse.json({
            success: true,
            messageId: response,
            message: "Notification sent successfully",
        });
    } catch (error) {
        console.error("Error sending notification:", error);

        if (error instanceof Error) {
            if (error.message.includes("registration-token-not-registered")) {
                return NextResponse.json(
                    { error: "Invalid or expired token" },
                    { status: 400 }
                );
            }

            if (error.message.includes("invalid-argument")) {
                return NextResponse.json(
                    { error: "Invalid notification payload" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Send notification endpoint",
        method: "POST",
        requiredFields: ["token", "title", "message"],
        optionalFields: ["link", "icon"],
    });
}
