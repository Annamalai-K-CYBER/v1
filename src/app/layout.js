import "./../styles/globals.css";
import BeamsInit from "./BeamsInit";

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <BeamsInit />
      </body>
    </html>
  );
}
