import type { Metadata } from "next";
import "./globals.css";
import { applicationDescription, applicationName } from "../app-config";
import { mainFont } from "../lib/fonts";

export const metadata: Metadata = {
  title: applicationName,
  description: applicationDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
