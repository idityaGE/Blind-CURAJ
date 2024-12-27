import type { Metadata } from "next";
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Inter } from 'next/font/google'
import "./globals.css";
import { Toaster } from '@/components/ui/toaster'
import { studentEmailConfig } from "@/config/student-email.config";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `Blind ${studentEmailConfig.college.shortHand}`,
  description: 'Random chat for university students',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
