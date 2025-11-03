"use client"; // 👈 this makes it a client component
import { useEffect } from "react";
import Script from "next/script";

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function () {
        OneSignal.init({
          appId: "dc464e50-ff8f-4ce6-a1b2-6d3805b556c2", // 👈 Replace this
          notifyButton: { enable: true },
        });

        // Show permission prompt automatically (optional)
        OneSignal.showSlidedownPrompt();
      });
    }
  }, []);

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
      strategy="beforeInteractive"
    />
  );
}
