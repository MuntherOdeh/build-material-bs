'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('common');
  const tFooter = useTranslations('footer');

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isRTL = locale === 'ar';
  const localePath = (path: string) => `/${locale}${path}`;
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const quickLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/products?category=cement', label: t('categories') },
    { href: '/pos', label: t('pos') },
    { href: '/admin', label: t('admin') },
  ];

  const customerServiceLinks = [
    { href: '/contact', label: t('contactUs') },
    { href: '/faq', label: tFooter('faq') },
    { href: '/shipping', label: tFooter('shipping') },
    { href: '/returns', label: tFooter('returns') },
    { href: '/terms', label: t('termsOfService') },
    { href: '/privacy', label: t('privacyPolicy') },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', hoverColor: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', hoverColor: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', label: 'Instagram', hoverColor: 'hover:text-pink-400' },
    { icon: Youtube, href: '#', label: 'YouTube', hoverColor: 'hover:text-red-400' },
  ];

  return (
    <footer className="relative bg-dark-950 text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 py-12 lg:py-16">
          {/* About / Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href={localePath('/')} className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
                <Building2 className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">
                  {isRTL ? 'بنيان' : 'Bunyan'}
                </span>
                <span className="text-[10px] font-medium text-dark-400 leading-none">
                  {t('appTagline')}
                </span>
              </div>
            </Link>

            <p className="text-sm text-dark-300 leading-relaxed max-w-sm">
              {tFooter('description')}
            </p>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                {t('followUs')}
              </h4>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg bg-dark-900 text-dark-400 ${social.hoverColor} hover:bg-dark-800 transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary-500" />
              {tFooter('quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href)}
                    className="text-sm text-dark-400 hover:text-primary-400 transition-colors duration-300 inline-flex items-center gap-1.5 group"
                  >
                    <span
                      className={`w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-300 ${
                        isRTL ? 'mr-0 group-hover:mr-0' : 'ml-0 group-hover:ml-0'
                      }`}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary-500" />
              {tFooter('customerService')}
            </h3>
            <ul className="space-y-2.5">
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href)}
                    className="text-sm text-dark-400 hover:text-primary-400 transition-colors duration-300 inline-flex items-center gap-1.5 group"
                  >
                    <span
                      className={`w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-300`}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Work Hours */}
              <li className="pt-2 space-y-1">
                <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                  {tFooter('workHours')}
                </p>
                <p className="text-sm text-dark-300">{tFooter('workDays')}</p>
                <p className="text-sm text-dark-300">{tFooter('friday')}</p>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-primary-500" />
                {t('contactUs')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-dark-900 text-primary-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">{t('phone')}</p>
                    <p className="text-sm text-dark-200" dir="ltr">
                      +970 599 123 456
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-dark-900 text-primary-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">{t('email')}</p>
                    <p className="text-sm text-dark-200">info@bunyan.ps</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-dark-900 text-primary-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">{t('address')}</p>
                    <p className="text-sm text-dark-200">
                      {isRTL
                        ? 'فلسطين، الضفة الغربية'
                        : 'Palestine, West Bank'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-primary-500" />
                {tFooter('newsletter')}
              </h3>
              <p className="text-xs text-dark-400 mb-3">
                {tFooter('newsletterDesc')}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tFooter('emailPlaceholder')}
                  required
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-xl bg-dark-900 border border-dark-800 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-300`}
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.97]"
                >
                  {tFooter('subscribe')}
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs text-emerald-400 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  {isRTL
                    ? 'تم الاشتراك بنجاح!'
                    : 'Successfully subscribed!'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800/60 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-dark-500 text-center sm:text-start">
              &copy; {currentYear} {isRTL ? 'بنيان' : 'Bunyan'}.{' '}
              {t('allRightsReserved')}
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-dark-500">
                {isRTL ? 'طرق الدفع:' : 'Payment:'}
              </span>
              <div className="flex items-center gap-2">
                {['Visa', 'MC', 'PayPal', 'Apple'].map((method) => (
                  <div
                    key={method}
                    className="h-7 px-2.5 flex items-center justify-center rounded-md bg-dark-900 border border-dark-800 text-[10px] font-bold text-dark-400 tracking-wide uppercase"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <Link
                href={localePath('/terms')}
                className="text-dark-500 hover:text-primary-400 transition-colors duration-300"
              >
                {t('termsOfService')}
              </Link>
              <span className="text-dark-700">|</span>
              <Link
                href={localePath('/privacy')}
                className="text-dark-500 hover:text-primary-400 transition-colors duration-300"
              >
                {t('privacyPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
