import type { Metadata } from "next";
import "./globals.css";
import { applicationDescription, applicationName } from "../app-config";
import { mainFont } from "../lib/fonts";
import { Navbar } from "../components/ui/Navbar";

export const metadata: Metadata = {
  title: applicationName,
  description: applicationDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mainFont.className}>
        <Navbar />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
