'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const featuredProducts = [
  {
    id: 'prod-001',
    name: 'Portland Cement 50kg',
    nameAr: 'إسمنت بورتلاندي 50 كغ',
    price: 35,
    salePrice: 29.99,
    image: 'https://plus.unsplash.com/premium_photo-1682971133961-92ee4d028972?w=400&q=80',
    category: 'Cement',
    categoryAr: 'إسمنت',
    unit: 'Bag',
    unitAr: 'كيس',
    stock: 500,
    sku: 'CMT-001',
  },
  {
    id: 'prod-002',
    name: 'Steel Rebar 12mm',
    nameAr: 'حديد تسليح 12 مم',
    price: 85,
    image: 'https://plus.unsplash.com/premium_photo-1681690860636-3d96ea7a593b?w=400&q=80',
    category: 'Steel',
    categoryAr: 'حديد',
    unit: 'Ton',
    unitAr: 'طن',
    stock: 120,
    sku: 'STL-002',
  },
  {
    id: 'prod-003',
    name: 'Ceramic Floor Tiles',
    nameAr: 'بلاط سيراميك أرضي',
    price: 45,
    salePrice: 38,
    image: 'https://plus.unsplash.com/premium_photo-1755647592373-f770023424ac?w=400&q=80',
    category: 'Tiles',
    categoryAr: 'بلاط',
    unit: 'Sq. Meter',
    unitAr: 'متر مربع',
    stock: 2000,
    sku: 'TIL-003',
  },
  {
    id: 'prod-004',
    name: 'Interior Paint 18L',
    nameAr: 'دهان داخلي 18 لتر',
    price: 120,
    image: 'https://plus.unsplash.com/premium_photo-1726880569484-df8b2ecab629?w=400&q=80',
    category: 'Paint',
    categoryAr: 'دهانات',
    unit: 'Piece',
    unitAr: 'قطعة',
    stock: 300,
    sku: 'PNT-004',
  },
  {
    id: 'prod-005',
    name: 'LED Panel Light',
    nameAr: 'لوحة إضاءة LED',
    price: 65,
    salePrice: 49.99,
    image: 'https://plus.unsplash.com/premium_photo-1683880731785-e5b632e0ea13?w=400&q=80',
    category: 'Electrical',
    categoryAr: 'كهرباء',
    unit: 'Piece',
    unitAr: 'قطعة',
    stock: 450,
    sku: 'ELC-005',
  },
  {
    id: 'prod-006',
    name: 'PVC Pipes',
    nameAr: 'أنابيب PVC',
    price: 25,
    image: 'https://plus.unsplash.com/premium_photo-1661577094877-725f859aff3e?w=400&q=80',
    category: 'Plumbing',
    categoryAr: 'سباكة',
    unit: 'Meter',
    unitAr: 'متر',
    stock: 1000,
    sku: 'PLB-006',
  },
  {
    id: 'prod-007',
    name: 'Hardwood Door',
    nameAr: 'باب خشب صلب',
    price: 450,
    salePrice: 389,
    image: 'https://plus.unsplash.com/premium_photo-1690922643728-de40d4dec452?w=400&q=80',
    category: 'Wood',
    categoryAr: 'خشب',
    unit: 'Piece',
    unitAr: 'قطعة',
    stock: 50,
    sku: 'WOD-007',
  },
  {
    id: 'prod-008',
    name: 'Power Drill',
    nameAr: 'مثقاب كهربائي',
    price: 199,
    image: 'https://plus.unsplash.com/premium_photo-1721460167354-b55c73c05331?w=400&q=80',
    category: 'Tools',
    categoryAr: 'أدوات',
    unit: 'Piece',
    unitAr: 'قطعة',
    stock: 80,
    sku: 'TLS-008',
  },
];

export default function FeaturedProducts() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'ur';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 lg:mb-16 gap-4">
          <div className="text-center sm:text-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-3">
              {t('featured.title')}
            </h2>
            <p className="text-lg text-dark-500">
              {t('featured.subtitle')}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors shrink-0 group"
          >
            {t('common.viewAll')}
            <Arrow className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
