'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  image: string;
  category?: string;
  categoryAr?: string;
  unit: string;
  unitAr: string;
  stock: number;
  sku: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const addItem = useCartStore((state) => state.addItem);

  const displayName = isRTL ? product.nameAr : product.name;
  const displayUnit = isRTL ? product.unitAr : product.unit;
  const displayCategory = isRTL ? product.categoryAr : product.category;
  const displayPrice = product.salePrice || product.price;
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: displayPrice,
      image: product.image,
      unit: product.unit,
      unitAr: product.unitAr,
      stock: product.stock,
    });
    toast.success(t('product.addedToCart'), {
      icon: '🛒',
    });
  };

  const salePercent = isOnSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <Link href={`/${locale}/products/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-dark-200/10 hover:-translate-y-1">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Sale badge */}
          {isOnSale && (
            <div className="absolute top-3 start-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              -{salePercent}%
            </div>
          )}

          {/* Stock badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-dark-950/50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg">
                {t('common.outOfStock')}
              </span>
            </div>
          )}

          {/* Hover overlay with quick actions */}
          <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary-500 hover:text-white transition-all duration-200 translate-y-4 group-hover:translate-y-0"
              title={t('common.addToCart')}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 translate-y-4 group-hover:translate-y-0"
              style={{ transitionDelay: '50ms' }}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-secondary-500 hover:text-white transition-all duration-200 translate-y-4 group-hover:translate-y-0"
              style={{ transitionDelay: '100ms' }}
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          {/* Category */}
          {displayCategory && (
            <p className="text-xs font-medium text-primary-600 mb-1.5 uppercase tracking-wide">
              {displayCategory}
            </p>
          )}

          {/* Product name */}
          <h3 className="font-semibold text-dark-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm lg:text-base">
            {displayName}
          </h3>

          {/* Rating stars (decorative) */}
          <div className="flex items-center gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
            <span className="text-xs text-dark-400 ms-1">(4.0)</span>
          </div>

          {/* Price and unit */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(displayPrice, locale)}
                </span>
                {isOnSale && (
                  <span className="text-sm text-dark-400 line-through">
                    {formatPrice(product.price, locale)}
                  </span>
                )}
              </div>
              <p className="text-xs text-dark-400 mt-0.5">
                / {displayUnit}
              </p>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? t('common.inStock') : t('common.outOfStock')}
              </span>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-dark-900 hover:bg-primary-600 text-white disabled:bg-dark-200 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('common.addToCart')}
          </button>
        </div>
      </div>
    </Link>
  );
}
