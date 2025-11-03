"use client";
import { useEffect } from "react";
import PusherPushNotifications from "@pusher/push-notifications-web";

export default function BeamsInit() {
  useEffect(() => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE_ID,
    });

    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("general"))
      .then(() => console.log("🟢 Beams initialized"))
      .catch(console.error);
  }, []);

  return null;
}
