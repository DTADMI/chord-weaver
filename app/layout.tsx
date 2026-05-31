import type { Metadata } from "next";
import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chord Weaver",
  description: "Convert songs to chords and chords to audio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-surface text-stone-900 antialiased dark:bg-surface-dark dark:text-stone-100">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
