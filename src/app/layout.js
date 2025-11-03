import "../styles/globals.css";
import NotificationSetup from "./NotificationSetup"; // 👈 same folder, correct path

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <NotificationSetup /> {/* ✅ loads your push notification setup */}
      </body>
    </html>
  );
}
