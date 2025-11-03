"use client";
import NotificationSetup from "./NotificationSetup";

export default function HomePage() {
  return (
    <div>
      <NotificationSetup />
      <h1>Welcome to Dashboard</h1>
      <p>Your device is being registered for push notifications...</p>
    </div>
  );
}
