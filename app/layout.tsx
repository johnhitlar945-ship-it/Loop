import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'LOOP — Stories worth your time',
  description: 'A fresh mix of news, culture, entertainment, technology and stories.'
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
