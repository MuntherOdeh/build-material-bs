import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'بنيان | Bunyan - Building Materials Store',
  description: 'أكبر متجر لمواد البناء - The largest building materials store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
