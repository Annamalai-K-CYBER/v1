"use client";
import { useEffect } from "react";
import PushNotifications from "@pusher/push-notifications-web";

export default function PusherInit() {
  useEffect(() => {
    const beamsClient = new PushNotifications({
      instanceId: "22594cbd-2c67-4ca5-91ca-1125afd2b102", // 👈 from Pusher dashboard
    });

    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("general")) // 👈 subscribe user to topic
      .then(() => console.log("Successfully registered with Pusher Beams!"))
      .catch((err) => console.error("Beams setup error:", err));
  }, []);

  return null;
}
