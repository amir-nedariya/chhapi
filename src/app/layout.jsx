import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Donation Platform",
  description: "Donation Platform application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
