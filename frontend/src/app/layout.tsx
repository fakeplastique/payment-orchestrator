import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { MasterLayout } from '@/components/layout/MasterLayout';
import '@/styles/globals.scss';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Payment Orchestrator',
  description: 'Payment Orchestrator Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <MasterLayout>{children}</MasterLayout>
      </body>
    </html>
  );
}
