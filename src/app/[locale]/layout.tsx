import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getDirection } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Toaster
            position={dir === 'rtl' ? 'top-left' : 'top-right'}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: '#333',
                color: '#fff',
                fontFamily: dir === 'rtl' ? 'Cairo, sans-serif' : 'Inter, sans-serif',
              },
            }}
          />
          <Navbar locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
