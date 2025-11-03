"use client";
import { useEffect } from "react";
import PusherPushNotifications from "@pusher/push-notifications-web";

export default function NotificationSetup() {
  useEffect(() => {
    // ✅ Replace with your actual Instance ID from Pusher Beams dashboard
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: "22594cbd-2c67-4ca5-91ca-1125afd2b102",
    });

    // Start the client and subscribe the device
    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("general")) // topic name — you can change
      .then(() => console.log("✅ Device registered for notifications!"))
      .catch((err) => console.error("❌ Pusher Beams error:", err));
  }, []);

  return null; // No UI, it just runs once
}
