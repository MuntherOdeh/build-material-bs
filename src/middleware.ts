import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});

export default function middleware(request: NextRequest) {
  // Delete any NEXT_LOCALE cookie that could override the default Arabic locale
  request.cookies.delete('NEXT_LOCALE');

  const response = intlMiddleware(request);

  // For paths without a locale prefix (i.e. default Arabic), force the cookie to 'ar'
  const pathname = request.nextUrl.pathname;
  const hasLocalePrefix = locales.some(
    (l) => l !== defaultLocale && (pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
  );

  if (!hasLocalePrefix) {
    response.cookies.set('NEXT_LOCALE', defaultLocale);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
