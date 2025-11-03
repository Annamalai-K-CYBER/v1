import "./../styles/globals.css";
import Script from "next/script"; // ✅ important for loading OneSignal SDK
import { useEffect } from "react";

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function () {
        OneSignal.init({
          appId: "YOUR-ONESIGNAL-APP-ID", // 👈 Replace with your real OneSignal App ID
          notifyButton: { enable: true }, // shows the bell icon
        });

        // Optional: auto show permission popup
        OneSignal.showSlidedownPrompt();
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        {/* ✅ Load OneSignal SDK once */}
        <Script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          strategy="beforeInteractive"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
