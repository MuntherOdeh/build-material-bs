'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Bell,
  Settings,
} from 'lucide-react';

interface StatCard {
  titleKey: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  customerAr: string;
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  sold: number;
  revenue: number;
}

const recentOrders: RecentOrder[] = [
  { id: 'ORD-260301-1234', customer: 'Ahmad Hassan', customerAr: 'أحمد حسن', items: 5, total: 1250, status: 'delivered', date: '2026-03-10' },
  { id: 'ORD-260301-1235', customer: 'Mohammad Ali', customerAr: 'محمد علي', items: 3, total: 890, status: 'shipped', date: '2026-03-10' },
  { id: 'ORD-260301-1236', customer: 'Sara Ibrahim', customerAr: 'سارة إبراهيم', items: 8, total: 2340, status: 'processing', date: '2026-03-09' },
  { id: 'ORD-260301-1237', customer: 'Khaled Omar', customerAr: 'خالد عمر', items: 2, total: 450, status: 'confirmed', date: '2026-03-09' },
  { id: 'ORD-260301-1238', customer: 'Fatima Nasser', customerAr: 'فاطمة ناصر', items: 6, total: 1780, status: 'pending', date: '2026-03-08' },
  { id: 'ORD-260301-1239', customer: 'Youssef Mahmoud', customerAr: 'يوسف محمود', items: 1, total: 320, status: 'cancelled', date: '2026-03-08' },
  { id: 'ORD-260301-1240', customer: 'Noor Adel', customerAr: 'نور عادل', items: 4, total: 960, status: 'delivered', date: '2026-03-07' },
  { id: 'ORD-260301-1241', customer: 'Rami Saleh', customerAr: 'رامي صالح', items: 7, total: 3100, status: 'shipped', date: '2026-03-07' },
];

const topProducts: TopProduct[] = [
  { id: '1', name: 'Portland Cement 50kg', nameAr: 'إسمنت بورتلاندي 50 كيلو', image: 'https://plus.unsplash.com/premium_photo-1682971133961-92ee4d028972?w=400&q=80', sold: 1240, revenue: 29760 },
  { id: '2', name: 'Steel Rebar 12mm', nameAr: 'حديد تسليح 12 ملم', image: 'https://plus.unsplash.com/premium_photo-1682971133961-92ee4d028972?w=400&q=80', sold: 890, revenue: 35600 },
  { id: '3', name: 'Ceramic Floor Tile 60x60', nameAr: 'بلاط سيراميك أرضي 60×60', image: 'https://plus.unsplash.com/premium_photo-1682971133961-92ee4d028972?w=400&q=80', sold: 750, revenue: 28500 },
  { id: '4', name: 'Interior Wall Paint 18L', nameAr: 'دهان حائط داخلي 18 لتر', image: 'https://plus.unsplash.com/premium_photo-1681690860636-3d96ea7a593b?w=400&q=80', sold: 620, revenue: 74400 },
  { id: '5', name: 'Power Drill 750W', nameAr: 'شنيور كهربائي 750 واط', image: 'https://plus.unsplash.com/premium_photo-1755647592373-f770023424ac?w=400&q=80', sold: 340, revenue: 62900 },
];

const sidebarItems = [
  { key: 'dashboard', icon: BarChart3, active: true },
  { key: 'products', icon: Package, active: false },
  { key: 'orders', icon: ShoppingCart, active: false },
  { key: 'customers', icon: Users, active: false },
  { key: 'reports', icon: TrendingUp, active: false },
  { key: 'settings', icon: Settings, active: false },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Mini chart data (simulated bar heights)
const chartData = [35, 58, 42, 70, 55, 80, 65, 45, 72, 60, 85, 50];

export default function AdminPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats: StatCard[] = [
    {
      titleKey: 'totalRevenue',
      value: formatPrice(125430, locale),
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      titleKey: 'totalOrders',
      value: '342',
      change: 8.2,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      titleKey: 'totalProducts',
      value: '156',
      change: -2.4,
      icon: <Package className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      titleKey: 'totalCustomers',
      value: '1,205',
      change: 5.7,
      icon: <Users className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white min-h-screen sticky top-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            {t('common.appName')}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{t('admin.title')}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {t(`admin.${item.key}`)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">admin@bunyan.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar - Mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900">{t('admin.title')}</h1>
            <div className="flex items-center gap-2">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto py-3">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        item.active
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t(`admin.${item.key}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {isRTL ? 'مرحباً بك في لوحة التحكم' : 'Welcome to your dashboard'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden lg:flex items-center gap-2 p-2 text-gray-600 hover:bg-white rounded-xl border border-gray-200 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              </button>
              <button className="hidden lg:flex items-center gap-2 p-2 text-gray-600 hover:bg-white rounded-xl border border-gray-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.change >= 0
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {stat.change >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{t(`admin.${stat.titleKey}`)}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              {t('admin.addProduct')}
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200">
              <Eye className="w-4 h-4" />
              {t('admin.orders')}
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200">
              <Package className="w-4 h-4" />
              {t('admin.inventory')}
            </button>
          </div>

          {/* Mini Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">{t('admin.reports')}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isRTL ? 'إيرادات آخر 12 شهر' : 'Revenue last 12 months'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <TrendingUp className="w-4 h-4" />
                +12.5%
              </div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {chartData.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-md transition-all hover:from-orange-600 hover:to-orange-400"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-gray-400">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{t('admin.recentOrders')}</h3>
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                  <input
                    type="text"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-48`}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-start px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {isRTL ? 'رقم الطلب' : 'Order #'}
                      </th>
                      <th className="text-start px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {isRTL ? 'العميل' : 'Customer'}
                      </th>
                      <th className="text-start px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {t('cart.items')}
                      </th>
                      <th className="text-start px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {t('common.total')}
                      </th>
                      <th className="text-start px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {t('admin.orderStatus')}
                      </th>
                      <th className="text-start px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {isRTL ? 'التاريخ' : 'Date'}
                      </th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900 text-xs">
                          {order.id}
                        </td>
                        <td className="px-5 py-3.5 text-gray-700">
                          {isRTL ? order.customerAr : order.customer}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">{order.items}</td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900">
                          {formatPrice(order.total, locale)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                          >
                            {t(`admin.${order.status}`)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">{order.date}</td>
                        <td className="px-5 py-3.5">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">{t('admin.topProducts')}</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {topProducts.map((product, i) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400 w-5">
                        {i + 1}
                      </span>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img
                          src={product.image}
                          alt={isRTL ? product.nameAr : product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {isRTL ? product.nameAr : product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sold} {isRTL ? 'مبيع' : 'sold'}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.revenue, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
