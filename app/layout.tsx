import { fontSans } from '@/config/fonts';
import '@/styles/globals.css';
import clsx from 'clsx';
import { Providers } from './providers';
import { ThemeToggle } from '@/components/themeToggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx('bg-background font-sans antialiased', fontSans.variable)}>
        <Providers>
          <div className="relative flex flex-col pt-10">
            <main className="container mx-auto max-w-8xl px-6 flex-grow">{children}</main>
          </div>
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
