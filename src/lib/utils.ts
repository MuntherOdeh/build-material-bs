export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number, locale: string = 'ar') {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
  }).format(price);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${y}${m}${d}-${r}`;
}

export function getDirection(locale: string) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
