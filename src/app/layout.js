import "./../styles/globals.css";

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
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