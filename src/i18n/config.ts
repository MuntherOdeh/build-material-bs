export const locales = ['ar', 'en', 'ur'] as const;
export const defaultLocale = 'ar' as const;

export type Locale = (typeof locales)[number];

// RTL locales
export const rtlLocales = ['ar', 'ur'] as const;
