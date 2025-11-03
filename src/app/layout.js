import "./../styles/globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "CSBS SYNC",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script charset="UTF-8" src="//web.webpushs.com/js/push/bd9190069fcb1b2d3ec0d0b8222dceaa_1.js" async></script>
      <body>{children}</body>
      {/* <Analytics />          */}
    </html>
  );
}