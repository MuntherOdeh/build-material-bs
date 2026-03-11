'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, BadgeDollarSign } from 'lucide-react';

const features = [
  {
    icon: Shield,
    titleKey: 'quality',
    descKey: 'qualityDesc',
    gradient: 'from-blue-500 to-blue-700',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: BadgeDollarSign,
    titleKey: 'prices',
    descKey: 'pricesDesc',
    gradient: 'from-green-500 to-green-700',
    bgLight: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: Truck,
    titleKey: 'delivery',
    descKey: 'deliveryDesc',
    gradient: 'from-primary-500 to-primary-700',
    bgLight: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    icon: Clock,
    titleKey: 'support',
    descKey: 'supportDesc',
    gradient: 'from-purple-500 to-purple-700',
    bgLight: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

export default function WhyUs() {
  const t = useTranslations('whyUs');

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="mt-4 w-20 h-1 bg-primary-500 rounded-full mx-auto" />
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 text-center h-full transition-all duration-300 hover:shadow-xl hover:shadow-dark-200/10 hover:-translate-y-1 border border-gray-100">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-dark-900 mb-3">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-dark-500 leading-relaxed text-sm lg:text-base">
                    {t(feature.descKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
