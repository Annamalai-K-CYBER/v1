import "./globals.css";
import NotificationSetup from "./NotificationSetup";

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <NotificationSetup /> {/* 👈 runs once in client */}
      </body>
    </html>
  );
}
