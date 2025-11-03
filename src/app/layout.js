import "./../styles/globals.css";
import OneSignalInit from "./OneSignalInit";

export const metadata = {
  title: "OneSignal Test App",
  description: "Push notification demo in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <OneSignalInit />
      </body>
    </html>
  );
}