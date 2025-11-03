import "./../styles/globals.css";
import OneSignalInit from "./OneSignalInit"; // 👈 import your client component

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <OneSignalInit /> {/* ✅ initializes OneSignal on client side */}
      </body>
    </html>
  );
}
