'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Globe,
  User,
  Building2,
  ChevronDown,
  Languages,
} from 'lucide-react';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('common');
  const tCat = useTranslations('categories');
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const itemCount = useCartStore((s) => s.getItemCount());

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categoriesRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'ar' || locale === 'ur';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Switch language handler - fast with router.replace
  const switchLanguage = (targetLocale: string) => {
    // Remove current locale prefix from pathname
    let path = pathname;
    for (const loc of ['ar', 'en', 'ur']) {
      if (path.startsWith(`/${loc}/`) || path === `/${loc}`) {
        path = path.slice(3) || '/';
        break;
      }
    }

    // Build new path - Arabic (default) has no prefix
    const newPath = targetLocale === 'ar' ? path : `/${targetLocale}${path}`;

    startTransition(() => {
      router.replace(newPath);
    });
    setMobileOpen(false);
  };

  // For default locale (ar), no prefix needed. For en, prefix with /en
  const localePath = (path: string) => {
    if (locale === 'ar') return path;
    return `/${locale}${path}`;
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/pos', label: t('pos') },
    { href: '/admin', label: t('admin') },
  ];

  const categories = [
    { key: 'cement', href: '/products?category=cement' },
    { key: 'steel', href: '/products?category=steel' },
    { key: 'wood', href: '/products?category=wood' },
    { key: 'paint', href: '/products?category=paint' },
    { key: 'electrical', href: '/products?category=electrical' },
    { key: 'plumbing', href: '/products?category=plumbing' },
    { key: 'tiles', href: '/products?category=tiles' },
    { key: 'tools', href: '/products?category=tools' },
    { key: 'sand', href: '/products?category=sand' },
    { key: 'insulation', href: '/products?category=insulation' },
    { key: 'glass', href: '/products?category=glass' },
    { key: 'safety', href: '/products?category=safety' },
  ];

  const isActive = (path: string) => {
    const fullPath = localePath(path);
    if (path === '/') return pathname === fullPath || pathname === `/${locale}`;
    return pathname.startsWith(fullPath);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-dark-950/5 border-b border-white/20'
            : 'bg-white'
        }`}
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              href={localePath('/')}
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-dark-950 leading-tight tracking-tight group-hover:text-primary-600 transition-colors duration-300">
                  {t('appName')}
                </span>
                <span className="text-[10px] font-medium text-dark-400 leading-none hidden sm:block">
                  {t('appTagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={localePath(link.href)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-dark-600 hover:text-dark-950 hover:bg-dark-50'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div ref={categoriesRef} className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    categoriesOpen
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-dark-600 hover:text-dark-950 hover:bg-dark-50'
                  }`}
                >
                  {t('categories')}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      categoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`absolute top-full mt-2 ${
                    isRTL ? 'right-0' : 'left-0'
                  } w-64 bg-white rounded-2xl shadow-xl shadow-dark-950/10 border border-dark-100 overflow-hidden transition-all duration-300 origin-top ${
                    categoriesOpen
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="p-2 max-h-80 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat.key}
                        href={localePath(cat.href)}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                      >
                        {tCat(cat.key)}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-dark-100 p-2">
                    <Link
                      href={localePath('/products')}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                      {t('viewAll')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search - Desktop */}
              <div className="hidden md:flex items-center relative">
                <div
                  className={`flex items-center transition-all duration-500 ease-out overflow-hidden ${
                    searchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search')}
                    className={`w-full ${
                      isRTL ? 'pr-4 pl-10' : 'pl-4 pr-10'
                    } py-2 text-sm rounded-xl border border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none bg-dark-50/50 transition-all duration-300`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <button
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    if (searchOpen) setSearchQuery('');
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                  aria-label="Search"
                >
                  {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                </button>
              </div>

              {/* Language Switcher - Desktop - VISIBLE with text */}
              <div className="hidden sm:flex items-center">
                <div className="flex items-center bg-dark-50 rounded-xl p-0.5 border border-dark-100">
                  {[
                    { code: 'ar', label: 'العربية' },
                    { code: 'en', label: 'EN' },
                    { code: 'ur', label: 'اردو' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      disabled={isPending}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        locale === lang.code
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                          : 'text-dark-500 hover:text-dark-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switcher - Mobile (small globe) */}
              <button
                onClick={() => {
                  const localeOrder = ['ar', 'en', 'ur'];
                  const nextIdx = (localeOrder.indexOf(locale) + 1) % localeOrder.length;
                  switchLanguage(localeOrder[nextIdx]);
                }}
                disabled={isPending}
                className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                aria-label="Switch language"
              >
                <Languages className="w-[18px] h-[18px]" />
              </button>

              {/* Cart */}
              <Link
                href={localePath('/cart')}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                aria-label={t('cart')}
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-primary-500 rounded-full ring-2 ring-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Login Button - Desktop */}
              <Link
                href={localePath('/auth/login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 active:scale-[0.97]"
              >
                <User className="w-4 h-4" />
                <span>{t('login')}</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-dark-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-dark-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
          isRTL ? 'right-0' : 'left-0'
        } ${
          mobileOpen
            ? 'translate-x-0'
            : isRTL
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-100">
            <Link
              href={localePath('/')}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-dark-950">
                {t('appName')}
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-dark-400 hover:text-dark-600 hover:bg-dark-50 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-dark-100">
            <div className="relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 ${
                  isRTL ? 'right-3.5' : 'left-3.5'
                }`}
              />
              <input
                type="text"
                placeholder={t('search')}
                className={`w-full py-2.5 text-sm rounded-xl border border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none bg-dark-50/50 transition-all duration-300 ${
                  isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href)}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-dark-600 hover:text-dark-950 hover:bg-dark-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Categories */}
            <div className="pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-dark-400 uppercase tracking-wider">
                {t('categories')}
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={localePath(cat.href)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  {tCat(cat.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-dark-100 space-y-3">
            {/* Language Switch - Mobile - Clear toggle buttons */}
            <div className="flex items-center gap-2 px-2">
              <Languages className="w-4 h-4 text-dark-400" />
              <div className="flex-1 flex items-center bg-dark-50 rounded-xl p-0.5 border border-dark-100">
                {[
                  { code: 'ar', label: 'العربية' },
                  { code: 'en', label: 'English' },
                  { code: 'ur', label: 'اردو' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    disabled={isPending}
                    className={`flex-1 px-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      locale === lang.code
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-dark-500 hover:text-dark-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <Link
              href={localePath('/auth/login')}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-md shadow-primary-500/20 transition-all duration-300 active:scale-[0.97]"
            >
              <User className="w-4 h-4" />
              {t('login')}
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar spacer */}
      <div className="h-[66px]" />
    </>
  );
}
