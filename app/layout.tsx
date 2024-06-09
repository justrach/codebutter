import { ThemeProvider } from '@/components/theme-provider';
import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
// import { dark, neobrutalism } from '@clerk/themes';
import {  Inter,  } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

let title = 'CodeButter';
let description =
  'CodeButter offers personalized coding challenges designed to help you learn and improve your coding skills effectively. Get started for free!';
let ogimage = 'https://codebutter.xyz/icon.png';
let url = 'https://www.codebutter.xyz.com/';
let sitename = 'CodeButter';
export const metadata: Metadata = {
  keywords: [
    'code',
    'this',
    'butter',
  ],
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      // appearance={{
      //   signIn: { baseTheme: neobrutalism },
      // }}
    >
      <html lang="en" className={inter.className} suppressHydrationWarning>

        <head>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </head>
      </html>
    </ClerkProvider>
  );
}
