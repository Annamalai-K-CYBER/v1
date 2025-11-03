import "./../styles/globals.css";
import PusherInit from "./PusherInit";

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PusherInit /> {/* ✅ Initializes Pusher Beams client */}
      </body>
    </html>
  );
}
