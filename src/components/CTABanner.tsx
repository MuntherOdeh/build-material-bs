'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';

export default function CTABanner() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800" />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
        <div className="absolute top-10 left-20 w-3 h-3 bg-white/20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-40 w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            {isRTL ? 'جاهز لبدء مشروعك؟' : 'Ready to Start Your Project?'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            {isRTL
              ? 'تصفح تشكيلتنا الواسعة من مواد البناء واحصل على أفضل الأسعار مع توصيل سريع'
              : 'Browse our wide selection of building materials and get the best prices with fast delivery'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {t('hero.shopNow')}
              <Arrow className="w-5 h-5" />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:bg-white/10"
            >
              <Phone className="w-5 h-5" />
              {t('common.contactUs')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
