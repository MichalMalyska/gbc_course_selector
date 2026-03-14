import { Inter } from "next/font/google"
import Script from "next/script"
import { themeScript } from "@/lib/theme"
import "./globals.css"

export const metadata = {
  metadataBase: new URL("https://georgebrown-course-scheduler.vercel.app"),
  title: "George Brown Course Search",
  description:
    "A simple Next.js app with a Postgres database and Drizzle as the ORM to display the George Brown Course Schedules for the current term",
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
