import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-headline'
});

const manrope = Manrope({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://brick-negotiate.vercel.app'),
  title: 'Brick Negotiate | Master AI Negotiation & Build Your Collection',
  description: 'Step into the highest-stakes modular marketplace. Negotiate with advanced AI sellers, earn Studs, and build the ultimate brick collection block by block.',
  keywords: ['LEGO negotiation', 'AI game', 'brick marketplace', 'negotiation simulator', 'modular bricks'],
  icons: {
    icon: 'https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png',
    apple: 'https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Brick Negotiate | Master AI Negotiation',
    description: 'Negotiate with advanced AI sellers and build your modular collection.',
    url: 'https://brick-negotiate.vercel.app',
    siteName: 'Brick Negotiate',
    images: [
      {
        url: 'https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png',
        width: 1200,
        height: 630,
        alt: 'Brick Negotiate Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brick Negotiate | Master AI Negotiation',
    description: 'Negotiate with advanced AI sellers and build your modular collection block by block.',
    images: ['https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

import AuthProvider from '@/components/AuthProvider';
import PageWrapper from '@/components/PageWrapper';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import FeedbackSticker from '@/components/FeedbackSticker';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className={`${plusJakartaSans.variable} ${manrope.variable} font-body bg-background text-on-background`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <PageWrapper>
            {children}
          </PageWrapper>
          <FeedbackSticker />
        </AuthProvider>
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
