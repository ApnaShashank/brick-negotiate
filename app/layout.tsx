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
  title: 'BRICK_NEGOTIATE - Master the Art of Negotiation',
  description: 'Build your deal block by block. Compete against advanced AI sellers in the ultimate high-stakes modular marketplace.',
  icons: {
    icon: 'https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png',
  },
  openGraph: {
    title: 'BRICK_NEGOTIATE',
    description: 'Master the Art of Negotiation',
    images: ['https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://ik.imagekit.io/DEMOPROJECT/1c75b464-a4d6-4a1f-9053-3cfa2951626e.png'],
  }
};

import AuthProvider from '@/components/AuthProvider';
import PageWrapper from '@/components/PageWrapper';

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
        </AuthProvider>
      </body>
    </html>
  );
}
