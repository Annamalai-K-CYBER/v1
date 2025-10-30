import "./../styles/globals.css";

export const metadata = {
  title: "CSBS Portal",
  description: "Official class portal for CSBS Department",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
