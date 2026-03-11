'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Landmark,
  Wrench,
  TreePine,
  Paintbrush,
  Zap,
  Droplets,
  Grid3X3,
  Hammer,
  Mountain,
  Thermometer,
  GlassWater,
  HardHat,
} from 'lucide-react';

const categories = [
  { key: 'cement', icon: Landmark, gradient: 'from-gray-600 to-gray-800', iconColor: 'text-gray-100' },
  { key: 'steel', icon: Wrench, gradient: 'from-blue-600 to-blue-800', iconColor: 'text-blue-100' },
  { key: 'wood', icon: TreePine, gradient: 'from-amber-600 to-amber-800', iconColor: 'text-amber-100' },
  { key: 'paint', icon: Paintbrush, gradient: 'from-rose-500 to-rose-700', iconColor: 'text-rose-100' },
  { key: 'electrical', icon: Zap, gradient: 'from-yellow-500 to-yellow-700', iconColor: 'text-yellow-100' },
  { key: 'plumbing', icon: Droplets, gradient: 'from-cyan-500 to-cyan-700', iconColor: 'text-cyan-100' },
  { key: 'tiles', icon: Grid3X3, gradient: 'from-indigo-500 to-indigo-700', iconColor: 'text-indigo-100' },
  { key: 'tools', icon: Hammer, gradient: 'from-orange-500 to-orange-700', iconColor: 'text-orange-100' },
  { key: 'sand', icon: Mountain, gradient: 'from-stone-500 to-stone-700', iconColor: 'text-stone-100' },
  { key: 'insulation', icon: Thermometer, gradient: 'from-teal-500 to-teal-700', iconColor: 'text-teal-100' },
  { key: 'glass', icon: GlassWater, gradient: 'from-sky-400 to-sky-600', iconColor: 'text-sky-100' },
  { key: 'safety', icon: HardHat, gradient: 'from-red-500 to-red-700', iconColor: 'text-red-100' },
];

export default function Categories() {
  const t = useTranslations('categories');
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="mt-4 w-20 h-1 bg-primary-500 rounded-full mx-auto" />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.key}
                href={`/${locale}/products?category=${category.key}`}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-dark-200/20 border border-gray-100 hover:border-transparent overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

                  {/* Icon */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:bg-white/20 group-hover:shadow-none transition-all duration-300`}>
                      <Icon className={`w-8 h-8 ${category.iconColor} transition-colors duration-300`} />
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-dark-800 group-hover:text-white transition-colors duration-300 text-sm lg:text-base leading-tight">
                      {t(category.key)}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
