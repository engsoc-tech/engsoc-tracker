import type { Metadata } from "next";
import "./globals.css";
import { applicationDescription, applicationName } from "../app-config";
import { mainFont } from "../lib/fonts";
import { Navbar } from "../components/ui/Navbar";
import { env } from "@/env";

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
        {
          process.env.NODE_ENV !== "production" && (

            <div className="bg-orange-500 text-white sticky z-50 text-center left-0 right-0 py-2 font-bold">
              TEST MODE
            </div>
          )}

        <Navbar />
        <div className="flex min-h-screen flex-col text-base">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
