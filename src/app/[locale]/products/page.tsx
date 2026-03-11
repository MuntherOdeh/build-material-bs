'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  X,
  Filter,
} from 'lucide-react';

const productImages = {
  portlandCement: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&q=80',
  whiteCement: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80',
  readyMix: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80',
  steelRebar: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&q=80',
  steelMesh: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=400&q=80',
  pineWood: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80',
  mdfBoard: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=400&q=80',
  interiorPaint: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
  exteriorPaint: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
  electricalWire: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=80',
  ledPanel: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&q=80',
  pvcPipe: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  waterHeater: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80',
  floorTile: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80',
  porcelainTile: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
  powerDrill: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
  angleGrinder: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
  sand: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  gravel: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&q=80',
  thermalInsulation: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&q=80',
  waterproofing: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  glassSheet: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80',
  mirror: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80',
  safetyHelmet: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80',
  safetyVest: 'https://images.unsplash.com/photo-1578874691223-64558a3ca096?w=400&q=80',
};

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  categoryAr: string;
  unit: string;
  unitAr: string;
  stock: number;
  sku: string;
  featured?: boolean;
}

const products: Product[] = [
  { id: '1', name: 'Portland Cement 50kg', nameAr: 'إسمنت بورتلاندي 50 كيلو', price: 28, salePrice: 24, image: productImages.portlandCement, category: 'Cement', categoryAr: 'إسمنت وخرسانة', unit: 'Bag', unitAr: 'كيس', stock: 500, sku: 'CEM-001', featured: true },
  { id: '2', name: 'White Cement 25kg', nameAr: 'إسمنت أبيض 25 كيلو', price: 35, image: productImages.whiteCement, category: 'Cement', categoryAr: 'إسمنت وخرسانة', unit: 'Bag', unitAr: 'كيس', stock: 200, sku: 'CEM-002' },
  { id: '3', name: 'Steel Rebar 12mm', nameAr: 'حديد تسليح 12 ملم', price: 45, salePrice: 40, image: productImages.steelRebar, category: 'Steel', categoryAr: 'حديد وصلب', unit: 'Meter', unitAr: 'متر', stock: 1000, sku: 'STL-001', featured: true },
  { id: '4', name: 'Steel Rebar 16mm', nameAr: 'حديد تسليح 16 ملم', price: 62, image: productImages.steelRebar, category: 'Steel', categoryAr: 'حديد وصلب', unit: 'Meter', unitAr: 'متر', stock: 800, sku: 'STL-002' },
  { id: '5', name: 'Pine Wood Plank 2x4', nameAr: 'خشب صنوبر 2×4', price: 18, image: productImages.pineWood, category: 'Wood', categoryAr: 'خشب وأبواب', unit: 'Piece', unitAr: 'قطعة', stock: 350, sku: 'WOD-001' },
  { id: '6', name: 'MDF Board 18mm', nameAr: 'لوح MDF 18 ملم', price: 85, salePrice: 72, image: productImages.mdfBoard, category: 'Wood', categoryAr: 'خشب وأبواب', unit: 'Piece', unitAr: 'قطعة', stock: 120, sku: 'WOD-002', featured: true },
  { id: '7', name: 'Interior Wall Paint 18L', nameAr: 'دهان حائط داخلي 18 لتر', price: 120, image: productImages.interiorPaint, category: 'Paint', categoryAr: 'دهانات وألوان', unit: 'Piece', unitAr: 'قطعة', stock: 80, sku: 'PNT-001' },
  { id: '8', name: 'Exterior Paint 18L', nameAr: 'دهان خارجي 18 لتر', price: 155, salePrice: 135, image: productImages.exteriorPaint, category: 'Paint', categoryAr: 'دهانات وألوان', unit: 'Piece', unitAr: 'قطعة', stock: 60, sku: 'PNT-002' },
  { id: '9', name: 'Electrical Cable 2.5mm 100m', nameAr: 'سلك كهربائي 2.5 ملم 100 متر', price: 95, image: productImages.electricalWire, category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'Roll', unitAr: 'رول', stock: 150, sku: 'ELC-001' },
  { id: '10', name: 'LED Panel Light 60x60', nameAr: 'لوحة إضاءة LED 60×60', price: 45, salePrice: 38, image: productImages.ledPanel, category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'Piece', unitAr: 'قطعة', stock: 200, sku: 'ELC-002', featured: true },
  { id: '11', name: 'PVC Pipe 4 inch', nameAr: 'أنبوب PVC 4 إنش', price: 22, image: productImages.pvcPipe, category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'Meter', unitAr: 'متر', stock: 400, sku: 'PLB-001' },
  { id: '12', name: 'Water Heater 50L', nameAr: 'سخان مياه 50 لتر', price: 320, salePrice: 280, image: productImages.waterHeater, category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'Piece', unitAr: 'قطعة', stock: 25, sku: 'PLB-002' },
  { id: '13', name: 'Ceramic Floor Tile 60x60', nameAr: 'بلاط سيراميك أرضي 60×60', price: 38, image: productImages.floorTile, category: 'Tiles', categoryAr: 'بلاط وسيراميك', unit: 'Sq. Meter', unitAr: 'متر مربع', stock: 2000, sku: 'TIL-001', featured: true },
  { id: '14', name: 'Porcelain Wall Tile 30x60', nameAr: 'بورسلين حائط 30×60', price: 55, salePrice: 48, image: productImages.porcelainTile, category: 'Tiles', categoryAr: 'بلاط وسيراميك', unit: 'Sq. Meter', unitAr: 'متر مربع', stock: 1500, sku: 'TIL-002' },
  { id: '15', name: 'Power Drill 750W', nameAr: 'شنيور كهربائي 750 واط', price: 185, image: productImages.powerDrill, category: 'Tools', categoryAr: 'أدوات ومعدات', unit: 'Piece', unitAr: 'قطعة', stock: 45, sku: 'TOL-001' },
  { id: '16', name: 'Angle Grinder 125mm', nameAr: 'صاروخ جلخ 125 ملم', price: 140, salePrice: 115, image: productImages.angleGrinder, category: 'Tools', categoryAr: 'أدوات ومعدات', unit: 'Piece', unitAr: 'قطعة', stock: 30, sku: 'TOL-002', featured: true },
  { id: '17', name: 'Building Sand (Ton)', nameAr: 'رمل بناء (طن)', price: 75, image: productImages.sand, category: 'Sand', categoryAr: 'رمل وحصى', unit: 'Ton', unitAr: 'طن', stock: 100, sku: 'SND-001' },
  { id: '18', name: 'Gravel Mix 20mm (Ton)', nameAr: 'حصى مخلوط 20 ملم (طن)', price: 65, image: productImages.gravel, category: 'Sand', categoryAr: 'رمل وحصى', unit: 'Ton', unitAr: 'طن', stock: 80, sku: 'SND-002' },
  { id: '19', name: 'Thermal Insulation Roll 50mm', nameAr: 'لفة عزل حراري 50 ملم', price: 42, salePrice: 36, image: productImages.thermalInsulation, category: 'Insulation', categoryAr: 'عزل وعوازل', unit: 'Roll', unitAr: 'رول', stock: 90, sku: 'INS-001' },
  { id: '20', name: 'Waterproof Membrane 1m', nameAr: 'عازل مائي 1 متر', price: 28, image: productImages.waterproofing, category: 'Insulation', categoryAr: 'عزل وعوازل', unit: 'Sq. Meter', unitAr: 'متر مربع', stock: 500, sku: 'INS-002' },
  { id: '21', name: 'Clear Glass 6mm', nameAr: 'زجاج شفاف 6 ملم', price: 55, image: productImages.glassSheet, category: 'Glass', categoryAr: 'زجاج ومرايا', unit: 'Sq. Meter', unitAr: 'متر مربع', stock: 300, sku: 'GLS-001' },
  { id: '22', name: 'Double Glazed Window', nameAr: 'نافذة زجاج مزدوج', price: 280, salePrice: 245, image: productImages.mirror, category: 'Glass', categoryAr: 'زجاج ومرايا', unit: 'Piece', unitAr: 'قطعة', stock: 40, sku: 'GLS-002', featured: true },
  { id: '23', name: 'Safety Helmet', nameAr: 'خوذة سلامة', price: 25, image: productImages.safetyHelmet, category: 'Safety', categoryAr: 'معدات سلامة', unit: 'Piece', unitAr: 'قطعة', stock: 200, sku: 'SAF-001' },
  { id: '24', name: 'Safety Vest High Vis', nameAr: 'سترة سلامة عاكسة', price: 18, image: productImages.safetyVest, category: 'Safety', categoryAr: 'معدات سلامة', unit: 'Piece', unitAr: 'قطعة', stock: 300, sku: 'SAF-002' },
  { id: '25', name: 'Ready Mix Concrete', nameAr: 'خرسانة جاهزة', price: 320, image: productImages.readyMix, category: 'Cement', categoryAr: 'إسمنت وخرسانة', unit: 'Ton', unitAr: 'طن', stock: 50, sku: 'CEM-003' },
  { id: '26', name: 'Steel Wire Mesh', nameAr: 'شبك حديد ملحوم', price: 95, salePrice: 82, image: productImages.steelMesh, category: 'Steel', categoryAr: 'حديد وصلب', unit: 'Piece', unitAr: 'قطعة', stock: 150, sku: 'STL-003' },
];

const categories = [
  'All', 'Cement', 'Steel', 'Wood', 'Paint', 'Electrical', 'Plumbing', 'Tiles', 'Tools', 'Sand', 'Insulation', 'Glass', 'Safety',
];

const categoryKeys: Record<string, string> = {
  All: 'all',
  Cement: 'cement',
  Steel: 'steel',
  Wood: 'wood',
  Paint: 'paint',
  Electrical: 'electrical',
  Plumbing: 'plumbing',
  Tiles: 'tiles',
  Tools: 'tools',
  Sand: 'sand',
  Insulation: 'insulation',
  Glass: 'glass',
  Safety: 'safety',
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name' | 'newest';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const addItem = useCartStore((s) => s.addItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showSort, setShowSort] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.nameAr.includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => (p.salePrice || p.price) >= priceRange[0] && (p.salePrice || p.price) <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name':
        filtered.sort((a, b) =>
          isRTL ? a.nameAr.localeCompare(b.nameAr, 'ar') : a.name.localeCompare(b.name)
        );
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, priceRange, isRTL]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.salePrice || product.price,
      image: product.image,
      unit: product.unit,
      unitAr: product.unitAr,
      stock: product.stock,
    });
    toast.success(t('product.addedToCart'));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: isRTL ? 'الافتراضي' : 'Default' },
    { value: 'price-asc', label: isRTL ? 'السعر: الأقل للأعلى' : 'Price: Low to High' },
    { value: 'price-desc', label: isRTL ? 'السعر: الأعلى للأقل' : 'Price: High to Low' },
    { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
    { value: 'name', label: isRTL ? 'الاسم' : 'Name' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">{t('common.products')}</h1>
          <p className="mt-1 text-orange-100">
            {isRTL ? 'تصفح جميع منتجات مواد البناء' : 'Browse all building materials products'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Controls Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
              <input
                type="text"
                placeholder={t('common.searchProducts')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors w-full lg:w-auto"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSort && (
                <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 min-w-[200px]`}>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setShowSort(false); }}
                      className={`w-full text-start px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${sortBy === option.value ? 'text-orange-600 bg-orange-50 font-medium' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">{isRTL ? 'الفلاتر' : 'Filters'}</span>
            </button>
          </div>

          {/* Category Pills - Mobile scrollable */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'All'
                  ? (isRTL ? 'الكل' : 'All')
                  : isRTL
                  ? products.find((p) => p.category === cat)?.categoryAr || cat
                  : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className={`hidden lg:block w-64 flex-shrink-0 ${showFilters ? '!block fixed inset-0 z-50 bg-black/50' : ''}`}>
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24 ${showFilters ? 'fixed top-0 bottom-0 w-80 z-50 overflow-y-auto' : ''} ${showFilters && isRTL ? 'right-0' : showFilters ? 'left-0' : ''}`}>
              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="lg:hidden absolute top-4 end-4">
                  <X className="w-5 h-5" />
                </button>
              )}

              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {isRTL ? 'تصفية النتائج' : 'Filter Products'}
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  {t('common.categories')}
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                      className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat
                          ? 'bg-orange-50 text-orange-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat === 'All'
                        ? (isRTL ? 'الكل' : 'All')
                        : isRTL
                        ? products.find((p) => p.category === cat)?.categoryAr || cat
                        : cat}
                      <span className="text-xs text-gray-400 ms-1">
                        ({cat === 'All' ? products.length : products.filter((p) => p.category === cat).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  {t('common.price')}
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={priceRange[1]}
                    onChange={(e) => { setPriceRange([priceRange[0], parseInt(e.target.value)]); setCurrentPage(1); }}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0], locale)}</span>
                    <span>-</span>
                    <span>{formatPrice(priceRange[1], locale)}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange([0, 500]);
                  setSearchQuery('');
                  setSortBy('default');
                  setCurrentPage(1);
                }}
                className="w-full py-2 text-sm text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
              >
                {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
              </button>
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div
                className={`absolute top-0 bottom-0 w-80 bg-white p-5 overflow-y-auto ${isRTL ? 'right-0' : 'left-0'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {isRTL ? 'تصفية النتائج' : 'Filter Products'}
                  </h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">{t('common.categories')}</h4>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setCurrentPage(1); setShowFilters(false); }}
                        className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat === 'All'
                          ? (isRTL ? 'الكل' : 'All')
                          : isRTL
                          ? products.find((p) => p.category === cat)?.categoryAr || cat
                          : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">{t('common.price')}</h4>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <span>{formatPrice(priceRange[0], locale)}</span>
                    <span>-</span>
                    <span>{formatPrice(priceRange[1], locale)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {isRTL
                  ? `عرض ${paginatedProducts.length} من ${filteredProducts.length} منتج`
                  : `Showing ${paginatedProducts.length} of ${filteredProducts.length} products`}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('common.noResults')}</h3>
                <p className="text-gray-500">
                  {isRTL ? 'جرب تغيير كلمات البحث أو الفلاتر' : 'Try changing your search or filters'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={isRTL ? product.nameAr : product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.salePrice && (
                        <div className="absolute top-3 start-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}%−
                        </div>
                      )}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 end-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          wishlist.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      {product.stock < 30 && product.stock > 0 && (
                        <div className="absolute bottom-3 start-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
                          {t('common.lowStock')}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-orange-600 font-medium mb-1">
                        {isRTL ? product.categoryAr : product.category}
                      </p>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                        {isRTL ? product.nameAr : product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-400 ms-1">(4.0)</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          {product.salePrice ? (
                            <>
                              <span className="text-lg font-bold text-orange-600">
                                {formatPrice(product.salePrice, locale)}
                              </span>
                              <span className="text-xs text-gray-400 line-through ms-2">
                                {formatPrice(product.price, locale)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price, locale)}
                            </span>
                          )}
                          <p className="text-xs text-gray-400">
                            / {isRTL ? product.unitAr : product.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={isRTL ? product.nameAr : product.name}
                        fill
                        className="object-cover"
                      />
                      {product.salePrice && (
                        <div className="absolute top-2 start-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}%−
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-orange-600 font-medium">
                          {isRTL ? product.categoryAr : product.category}
                        </p>
                        <h3 className="font-semibold text-gray-900 mt-1">
                          {isRTL ? product.nameAr : product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {product.salePrice ? (
                            <>
                              <span className="text-lg font-bold text-orange-600">
                                {formatPrice(product.salePrice, locale)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.price, locale)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price, locale)}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            / {isRTL ? product.unitAr : product.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                              wishlist.includes(product.id)
                                ? 'bg-red-50 border-red-200 text-red-500'
                                : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-medium"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {t('common.addToCart')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('common.previous')}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
