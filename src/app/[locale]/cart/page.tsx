'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  Truck,
} from 'lucide-react';

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const subtotal = getTotal();
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const taxRate = 0.17;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 300);
  };

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === 'bunyan10') {
      setDiscountApplied(true);
    }
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('cart.empty')}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{t('cart.emptyDesc')}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
          <p className="mt-1 text-orange-100">
            {isRTL
              ? `${items.length} منتجات في سلتك`
              : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-4">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <BackArrow className="w-4 h-4" />
                {t('cart.continueShopping')}
              </Link>
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                {t('cart.clearCart')}
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 transition-all duration-300 ${
                    removingId === item.id ? 'opacity-0 translate-x-10 scale-95' : 'opacity-100'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={isRTL ? item.nameAr : item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                            {isRTL ? item.nameAr : item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatPrice(item.price, locale)} / {isRTL ? item.unitAr : item.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title={t('cart.removeItem')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-bold text-gray-900 text-lg">
                          {formatPrice(item.price * item.quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">{t('cart.orderSummary')}</h2>

              {/* Discount Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {isRTL ? 'كود الخصم' : 'Discount Code'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder={isRTL ? 'أدخل الكود' : 'Enter code'}
                      className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none`}
                      disabled={discountApplied}
                    />
                  </div>
                  <button
                    onClick={handleApplyDiscount}
                    disabled={discountApplied || !discountCode}
                    className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {discountApplied
                      ? (isRTL ? 'تم' : 'Applied')
                      : (isRTL ? 'تطبيق' : 'Apply')}
                  </button>
                </div>
                {discountApplied && (
                  <p className="text-xs text-green-600 mt-1.5 font-medium">
                    {isRTL ? 'تم تطبيق خصم 10%!' : '10% discount applied!'}
                  </p>
                )}
              </div>

              {/* Summary Lines */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {t('common.subtotal')} ({items.length} {t('cart.items')})
                  </span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal, locale)}</span>
                </div>

                {discountApplied && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">{t('common.discount')} (10%)</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(discountAmount, locale)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t('common.tax')} (17%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(taxAmount, locale)}</span>
                </div>

                {/* Shipping Info */}
                <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-xl">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">
                    {isRTL ? 'التوصيل مجاني للطلبات فوق ₪500' : 'Free shipping on orders over ₪500'}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">{t('common.total')}</span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatPrice(total, locale)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isRTL ? 'شامل الضريبة' : 'Tax included'}
                  </p>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25">
                {t('cart.proceedToCheckout')}
                <ForwardArrow className="w-5 h-5" />
              </button>

              {/* Continue Shopping */}
              <Link
                href={`/${locale}/products`}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                <BackArrow className="w-4 h-4" />
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
