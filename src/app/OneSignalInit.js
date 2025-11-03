"use client";

import OneSignal from "react-onesignal";
import { useEffect } from "react";

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: "dc464e50-ff8f-4ce6-a1b2-6d3805b556c2", // Replace with real ID
      allowLocalhostAsSecureOrigin: true,
      notifyButton: { enable: true },
    });
  }, []);

  return null;
}
