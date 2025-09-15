import { fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/themeToggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
        <ThemeToggle />
          <div className="relative flex flex-col pt-10">
            <main className="container mx-auto max-w-7xl px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
