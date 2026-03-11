'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { usePOSStore } from '@/store/pos';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Building2,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Package,
  X,
  Printer,
  User,
  Phone,
  Hash,
  ChevronDown,
  Grid3X3,
  List,
} from 'lucide-react';

// ─── Product Data ──────────────────────────────────────────────────────────────

const CATEGORY_IMAGES: Record<string, string> = {
  'Cement & Concrete': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80',
  'Steel & Iron': 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200&q=80',
  'Wood & Doors': 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=200&q=80',
  'Paints & Colors': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&q=80',
  Electrical: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=200&q=80',
  Plumbing: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80',
  'Tiles & Ceramics': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Cement & Concrete': 'bg-gray-500',
  'Steel & Iron': 'bg-blue-600',
  'Wood & Doors': 'bg-amber-600',
  'Paints & Colors': 'bg-pink-500',
  Electrical: 'bg-yellow-500',
  Plumbing: 'bg-cyan-500',
  'Tiles & Ceramics': 'bg-emerald-500',
};

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  category: string;
  categoryAr: string;
  unit: string;
  unitAr: string;
  stock: number;
  sku: string;
  barcode: string;
}

const products: Product[] = [
  // ── Cement & Concrete ──
  { id: 'CEM001', name: 'Portland Cement 50kg', nameAr: 'إسمنت بورتلاندي 50كغ', price: 35, image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=200&q=80', category: 'Cement & Concrete', categoryAr: 'إسمنت وخرسانة', unit: 'bag', unitAr: 'كيس', stock: 500, sku: 'CEM-PORT-50', barcode: '7290001000011' },
  { id: 'CEM002', name: 'White Cement 25kg', nameAr: 'إسمنت أبيض 25كغ', price: 45, image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200&q=80', category: 'Cement & Concrete', categoryAr: 'إسمنت وخرسانة', unit: 'bag', unitAr: 'كيس', stock: 200, sku: 'CEM-WHT-25', barcode: '7290001000028' },
  { id: 'CEM003', name: 'Ready Mix Concrete', nameAr: 'خرسانة جاهزة', price: 280, image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&q=80', category: 'Cement & Concrete', categoryAr: 'إسمنت وخرسانة', unit: 'ton', unitAr: 'طن', stock: 50, sku: 'CEM-RDY-MX', barcode: '7290001000035' },
  { id: 'CEM004', name: 'Cement Blocks', nameAr: 'بلوك إسمنتي', price: 4.5, image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=200&q=80', category: 'Cement & Concrete', categoryAr: 'إسمنت وخرسانة', unit: 'piece', unitAr: 'حبة', stock: 2000, sku: 'CEM-BLK-01', barcode: '7290001000042' },
  { id: 'CEM005', name: 'Mortar Mix', nameAr: 'خلطة مونة', price: 22, image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&q=80', category: 'Cement & Concrete', categoryAr: 'إسمنت وخرسانة', unit: 'bag', unitAr: 'كيس', stock: 300, sku: 'CEM-MRT-01', barcode: '7290001000059' },

  // ── Steel & Iron ──
  { id: 'STL001', name: 'Steel Rebar 12mm', nameAr: 'حديد تسليح 12مم', price: 18, image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200&q=80', category: 'Steel & Iron', categoryAr: 'حديد وصلب', unit: 'meter', unitAr: 'متر', stock: 1000, sku: 'STL-RBR-12', barcode: '7290002000018' },
  { id: 'STL002', name: 'Steel Rebar 16mm', nameAr: 'حديد تسليح 16مم', price: 32, image: 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=200&q=80', category: 'Steel & Iron', categoryAr: 'حديد وصلب', unit: 'meter', unitAr: 'متر', stock: 800, sku: 'STL-RBR-16', barcode: '7290002000025' },
  { id: 'STL003', name: 'Steel Mesh', nameAr: 'شبك حديد', price: 85, image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=200&q=80', category: 'Steel & Iron', categoryAr: 'حديد وصلب', unit: 'sqm', unitAr: 'م²', stock: 150, sku: 'STL-MSH-01', barcode: '7290002000032' },
  { id: 'STL004', name: 'Binding Wire', nameAr: 'سلك ربط', price: 12, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80', category: 'Steel & Iron', categoryAr: 'حديد وصلب', unit: 'kg', unitAr: 'كغ', stock: 500, sku: 'STL-BWR-01', barcode: '7290002000049' },
  { id: 'STL005', name: 'Steel Angles', nameAr: 'زوايا حديد', price: 45, image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=200&q=80', category: 'Steel & Iron', categoryAr: 'حديد وصلب', unit: 'meter', unitAr: 'متر', stock: 300, sku: 'STL-ANG-01', barcode: '7290002000056' },

  // ── Wood & Doors ──
  { id: 'WOD001', name: 'Pine Wood Plank', nameAr: 'خشب صنوبر', price: 65, image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=200&q=80', category: 'Wood & Doors', categoryAr: 'خشب وأبواب', unit: 'meter', unitAr: 'متر', stock: 400, sku: 'WOD-PIN-01', barcode: '7290003000015' },
  { id: 'WOD002', name: 'MDF Board', nameAr: 'لوح MDF', price: 120, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=200&q=80', category: 'Wood & Doors', categoryAr: 'خشب وأبواب', unit: 'piece', unitAr: 'قطعة', stock: 100, sku: 'WOD-MDF-01', barcode: '7290003000022' },
  { id: 'WOD003', name: 'Interior Door', nameAr: 'باب داخلي', price: 450, image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=200&q=80', category: 'Wood & Doors', categoryAr: 'خشب وأبواب', unit: 'piece', unitAr: 'قطعة', stock: 30, sku: 'WOD-DOR-INT', barcode: '7290003000039' },
  { id: 'WOD004', name: 'Plywood Sheet', nameAr: 'خشب أبلكاش', price: 95, image: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=200&q=80', category: 'Wood & Doors', categoryAr: 'خشب وأبواب', unit: 'piece', unitAr: 'قطعة', stock: 80, sku: 'WOD-PLY-01', barcode: '7290003000046' },
  { id: 'WOD005', name: 'Wood Trim', nameAr: 'قص خشب', price: 15, image: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=200&q=80', category: 'Wood & Doors', categoryAr: 'خشب وأبواب', unit: 'meter', unitAr: 'متر', stock: 600, sku: 'WOD-TRM-01', barcode: '7290003000053' },

  // ── Paints & Colors ──
  { id: 'PNT001', name: 'Interior Paint 18L', nameAr: 'دهان داخلي 18 لتر', price: 180, image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=200&q=80', category: 'Paints & Colors', categoryAr: 'دهانات وألوان', unit: 'bucket', unitAr: 'سطل', stock: 60, sku: 'PNT-INT-18', barcode: '7290004000012' },
  { id: 'PNT002', name: 'Exterior Paint 18L', nameAr: 'دهان خارجي 18 لتر', price: 220, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&q=80', category: 'Paints & Colors', categoryAr: 'دهانات وألوان', unit: 'bucket', unitAr: 'سطل', stock: 45, sku: 'PNT-EXT-18', barcode: '7290004000029' },
  { id: 'PNT003', name: 'Wood Varnish', nameAr: 'ورنيش خشب', price: 85, image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=200&q=80', category: 'Paints & Colors', categoryAr: 'دهانات وألوان', unit: 'liter', unitAr: 'لتر', stock: 100, sku: 'PNT-VRN-01', barcode: '7290004000036' },
  { id: 'PNT004', name: 'Primer 10L', nameAr: 'أساس دهان 10 لتر', price: 95, image: 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=200&q=80', category: 'Paints & Colors', categoryAr: 'دهانات وألوان', unit: 'bucket', unitAr: 'سطل', stock: 70, sku: 'PNT-PRM-10', barcode: '7290004000043' },
  { id: 'PNT005', name: 'Spray Paint', nameAr: 'دهان بخاخ', price: 18, image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=200&q=80', category: 'Paints & Colors', categoryAr: 'دهانات وألوان', unit: 'piece', unitAr: 'حبة', stock: 200, sku: 'PNT-SPR-01', barcode: '7290004000050' },

  // ── Electrical ──
  { id: 'ELC001', name: 'LED Panel 60x60', nameAr: 'لوحة LED 60x60', price: 75, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&q=80', category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'piece', unitAr: 'قطعة', stock: 120, sku: 'ELC-LED-60', barcode: '7290005000019' },
  { id: 'ELC002', name: 'Electrical Wire 2.5mm', nameAr: 'سلك كهربائي 2.5مم', price: 2.5, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200&q=80', category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'meter', unitAr: 'متر', stock: 5000, sku: 'ELC-WIR-25', barcode: '7290005000026' },
  { id: 'ELC003', name: 'Switch Socket', nameAr: 'مفتاح ومقبس', price: 15, image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=200&q=80', category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'piece', unitAr: 'قطعة', stock: 300, sku: 'ELC-SWT-01', barcode: '7290005000033' },
  { id: 'ELC004', name: 'Circuit Breaker', nameAr: 'قاطع كهربائي', price: 35, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&q=80', category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'piece', unitAr: 'قطعة', stock: 150, sku: 'ELC-CBR-01', barcode: '7290005000040' },
  { id: 'ELC005', name: 'LED Bulb 12W', nameAr: 'لمبة LED 12 واط', price: 12, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&q=80', category: 'Electrical', categoryAr: 'كهرباء وإنارة', unit: 'piece', unitAr: 'قطعة', stock: 500, sku: 'ELC-BLB-12', barcode: '7290005000057' },

  // ── Plumbing ──
  { id: 'PLM001', name: 'PVC Pipe 4inch', nameAr: 'أنبوب PVC 4 إنش', price: 28, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80', category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'meter', unitAr: 'متر', stock: 400, sku: 'PLM-PVC-04', barcode: '7290006000016' },
  { id: 'PLM002', name: 'Water Heater 50L', nameAr: 'سخان مياه 50 لتر', price: 650, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&q=80', category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'piece', unitAr: 'قطعة', stock: 15, sku: 'PLM-WHT-50', barcode: '7290006000023' },
  { id: 'PLM003', name: 'Toilet Set', nameAr: 'طقم حمام', price: 850, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80', category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'piece', unitAr: 'قطعة', stock: 10, sku: 'PLM-TLT-01', barcode: '7290006000030' },
  { id: 'PLM004', name: 'Faucet', nameAr: 'حنفية', price: 120, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&q=80', category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'piece', unitAr: 'قطعة', stock: 60, sku: 'PLM-FCT-01', barcode: '7290006000047' },
  { id: 'PLM005', name: 'Water Tank 1000L', nameAr: 'خزان مياه 1000 لتر', price: 450, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80', category: 'Plumbing', categoryAr: 'سباكة وصحية', unit: 'piece', unitAr: 'قطعة', stock: 8, sku: 'PLM-TNK-1K', barcode: '7290006000054' },

  // ── Tiles & Ceramics ──
  { id: 'TIL001', name: 'Floor Tile 60x60', nameAr: 'بلاط أرضي 60x60', price: 45, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=80', category: 'Tiles & Ceramics', categoryAr: 'بلاط وسيراميك', unit: 'sqm', unitAr: 'م²', stock: 800, sku: 'TIL-FLR-60', barcode: '7290007000013' },
  { id: 'TIL002', name: 'Wall Tile 30x60', nameAr: 'بلاط جداري 30x60', price: 38, image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=200&q=80', category: 'Tiles & Ceramics', categoryAr: 'بلاط وسيراميك', unit: 'sqm', unitAr: 'م²', stock: 600, sku: 'TIL-WLL-30', barcode: '7290007000020' },
  { id: 'TIL003', name: 'Porcelain Tile', nameAr: 'بورسلان', price: 65, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80', category: 'Tiles & Ceramics', categoryAr: 'بلاط وسيراميك', unit: 'sqm', unitAr: 'م²', stock: 400, sku: 'TIL-PRC-01', barcode: '7290007000037' },
  { id: 'TIL004', name: 'Tile Adhesive 25kg', nameAr: 'لاصق بلاط 25كغ', price: 25, image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&q=80', category: 'Tiles & Ceramics', categoryAr: 'بلاط وسيراميك', unit: 'bag', unitAr: 'كيس', stock: 250, sku: 'TIL-ADH-25', barcode: '7290007000044' },
  { id: 'TIL005', name: 'Grout', nameAr: 'حشوة بلاط', price: 18, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=200&q=80', category: 'Tiles & Ceramics', categoryAr: 'بلاط وسيراميك', unit: 'bag', unitAr: 'كيس', stock: 350, sku: 'TIL-GRT-01', barcode: '7290007000051' },
];

const categories = [
  { key: 'all', name: 'All', nameAr: 'الكل' },
  { key: 'Cement & Concrete', name: 'Cement & Concrete', nameAr: 'إسمنت وخرسانة' },
  { key: 'Steel & Iron', name: 'Steel & Iron', nameAr: 'حديد وصلب' },
  { key: 'Wood & Doors', name: 'Wood & Doors', nameAr: 'خشب وأبواب' },
  { key: 'Paints & Colors', name: 'Paints & Colors', nameAr: 'دهانات وألوان' },
  { key: 'Electrical', name: 'Electrical', nameAr: 'كهرباء وإنارة' },
  { key: 'Plumbing', name: 'Plumbing', nameAr: 'سباكة وصحية' },
  { key: 'Tiles & Ceramics', name: 'Tiles & Ceramics', nameAr: 'بلاط وسيراميك' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function POSPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<'products' | 'sale'>('products');
  const [lastOrderNumber, setLastOrderNumber] = useState('');
  const [clickedProductId, setClickedProductId] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const {
    items,
    customerName,
    customerPhone,
    paymentMethod,
    discount,
    amountPaid,
    addItem,
    removeItem,
    updateQuantity,
    setCustomerName,
    setCustomerPhone,
    setPaymentMethod,
    setDiscount,
    setAmountPaid,
    getSubtotal,
    getTax,
    getTotal,
    getChange,
    clearSale,
  } = usePOSStore();

  // Hide nav/footer for full-screen POS
  useEffect(() => {
    document.querySelector('nav')?.classList.add('hidden');
    document.querySelector('footer')?.classList.add('hidden');
    return () => {
      document.querySelector('nav')?.classList.remove('hidden');
      document.querySelector('footer')?.classList.remove('hidden');
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'F9') {
        e.preventDefault();
        handleCompleteSale();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowReceiptModal(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, paymentMethod, amountPaid]);

  // ── Filtered products ──
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.nameAr.includes(searchQuery) ||
      p.sku.toLowerCase().includes(q) ||
      p.barcode.includes(q);
    return matchesCategory && matchesSearch;
  });

  // ── Handlers ──
  const handleAddProduct = (product: Product) => {
    if (product.stock <= 0) {
      toast.error(isRTL ? 'المنتج غير متوفر في المخزون' : 'Product out of stock');
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      unit: product.unit,
      unitAr: product.unitAr,
      stock: product.stock,
    });
    setClickedProductId(product.id);
    setTimeout(() => setClickedProductId(null), 300);
    toast.success(
      isRTL ? `تم إضافة ${product.nameAr}` : `Added ${product.name}`,
      { duration: 1500, icon: '🛒' }
    );
    // On mobile, show sale panel briefly after first item
    if (items.length === 0 && window.innerWidth < 1024) {
      setMobileTab('sale');
    }
  };

  const generateOrderNum = () => {
    const d = new Date();
    const y = d.getFullYear().toString().slice(-2);
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `POS-${y}${m}${day}-${r}`;
  };

  const handleCompleteSale = () => {
    if (items.length === 0) {
      toast.error(isRTL ? 'لا توجد منتجات في الفاتورة' : 'No items in the sale');
      return;
    }
    if (paymentMethod === 'CASH' && amountPaid < getTotal()) {
      toast.error(isRTL ? 'المبلغ المدفوع أقل من الإجمالي' : 'Amount paid is less than total');
      return;
    }
    const orderNum = generateOrderNum();
    setLastOrderNumber(orderNum);
    setShowReceiptModal(true);
    toast.success(isRTL ? 'تمت عملية البيع بنجاح!' : 'Sale completed successfully!', {
      duration: 3000,
      icon: '✅',
    });
  };

  const handleNewSale = () => {
    clearSale();
    setShowReceiptModal(false);
    toast(isRTL ? 'فاتورة جديدة' : 'New sale started', { icon: '📋', duration: 1500 });
  };

  const handlePrint = () => {
    window.print();
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();
  const change = getChange();

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Mobile Tab Switcher ── */}
      <div className="flex lg:hidden border-b border-gray-700">
        <button
          onClick={() => setMobileTab('products')}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
            mobileTab === 'products'
              ? 'bg-gray-800 text-white border-b-2 border-blue-500'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          <Package className="inline-block w-4 h-4 mb-0.5 me-1" />
          {isRTL ? 'المنتجات' : 'Products'}
        </button>
        <button
          onClick={() => setMobileTab('sale')}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors relative ${
            mobileTab === 'sale'
              ? 'bg-gray-800 text-white border-b-2 border-green-500'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          <ShoppingBag className="inline-block w-4 h-4 mb-0.5 me-1" />
          {isRTL ? 'الفاتورة' : 'Sale'}
          {items.length > 0 && (
            <span className="absolute top-1 end-4 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ════════════════════════════════════════════════════════════════════════
            LEFT — PRODUCT GRID (65%)
           ════════════════════════════════════════════════════════════════════════ */}
        <div
          className={`flex-col bg-gray-100 text-gray-900 ${
            mobileTab === 'products' ? 'flex' : 'hidden'
          } lg:flex lg:w-[65%] w-full`}
        >
          {/* ── Top Bar ── */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3 flex-wrap">
            {/* Logo */}
            <div className="flex items-center gap-2 me-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg whitespace-nowrap">
                {isRTL ? 'بنيان' : 'Bunyan'} <span className="text-blue-400">POS</span>
              </span>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder={isRTL ? 'بحث بالاسم، SKU أو باركود... (F2)' : 'Search by name, SKU, or barcode... (F2)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Back Link */}
            <a
              href={`/${locale}`}
              className="text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap hidden sm:block"
            >
              {isRTL ? '← العودة للموقع' : '← Back to site'}
            </a>
          </div>

          {/* ── Category Tabs ── */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.key
                    ? cat.key === 'all'
                      ? 'bg-gray-900 text-white shadow-lg'
                      : `${CATEGORY_COLORS[cat.key] || 'bg-gray-500'} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRTL ? cat.nameAr : cat.name}
              </button>
            ))}
          </div>

          {/* ── Product Grid ── */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Package className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">{isRTL ? 'لا توجد منتجات' : 'No products found'}</p>
                <p className="text-sm">{isRTL ? 'جرب البحث بكلمة أخرى' : 'Try a different search term'}</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className={`group bg-white rounded-xl border border-gray-200 overflow-hidden text-start hover:shadow-lg hover:border-blue-300 transition-all duration-200 active:scale-95 ${
                      clickedProductId === product.id ? 'ring-2 ring-blue-500 scale-95' : ''
                    } ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={product.stock <= 0}
                  >
                    {/* Image */}
                    <div className="relative w-full h-28 bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={isRTL ? product.nameAr : product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="200px"
                      />
                      {/* Stock badge */}
                      <div
                        className={`absolute top-2 end-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          product.stock > 50
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 10
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock > 50
                          ? isRTL ? 'متوفر' : 'In Stock'
                          : product.stock > 0
                          ? `${product.stock} ${isRTL ? 'متبقي' : 'left'}`
                          : isRTL ? 'نفد' : 'Out'}
                      </div>
                      {/* Category color strip */}
                      <div className={`absolute bottom-0 inset-x-0 h-1 ${CATEGORY_COLORS[product.category] || 'bg-gray-400'}`} />
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                      <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5 line-clamp-2">
                        {isRTL ? product.nameAr : product.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-bold text-blue-600">{formatPrice(product.price, locale)}</span>
                        <span className="text-[10px] text-gray-400">/{isRTL ? product.unitAr : product.unit}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* ── List View ── */
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className={`w-full flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 text-start hover:shadow-md hover:border-blue-300 transition-all active:scale-[0.99] ${
                      clickedProductId === product.id ? 'ring-2 ring-blue-500' : ''
                    } ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={product.stock <= 0}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image
                        src={product.image}
                        alt={isRTL ? product.nameAr : product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {isRTL ? product.nameAr : product.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{product.sku} | {product.barcode}</p>
                    </div>
                    <div className="text-end flex-shrink-0">
                      <p className="text-sm font-bold text-blue-600">{formatPrice(product.price, locale)}</p>
                      <p className="text-[10px] text-gray-400">/{isRTL ? product.unitAr : product.unit}</p>
                    </div>
                    <div
                      className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                        product.stock > 50
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 10
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock}
                    </div>
                    <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Count Footer ── */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {isRTL ? `${filteredProducts.length} منتج` : `${filteredProducts.length} products`}
            </span>
            <span className="text-gray-300">
              F2: {isRTL ? 'بحث' : 'Search'} | F9: {isRTL ? 'إتمام البيع' : 'Complete Sale'} | ESC: {isRTL ? 'إغلاق' : 'Close'}
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            RIGHT — SALE PANEL (35%)
           ════════════════════════════════════════════════════════════════════════ */}
        <div
          className={`flex-col bg-gray-950 text-white ${
            mobileTab === 'sale' ? 'flex' : 'hidden'
          } lg:flex lg:w-[35%] w-full border-s border-gray-800`}
        >
          {/* ── Sale Header ── */}
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-400" />
              <h2 className="font-bold text-lg">{isRTL ? 'الفاتورة الحالية' : 'Current Sale'}</h2>
            </div>
            <button
              onClick={handleNewSale}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isRTL ? 'جديد' : 'New'}
            </button>
          </div>

          {/* ── Customer Info ── */}
          <div className="px-4 py-3 border-b border-gray-800 space-y-2">
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder={isRTL ? 'اسم العميل' : 'Customer name'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full ps-10 pe-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div className="relative">
              <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full ps-10 pe-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* ── Items List ── */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <ShoppingBag className="w-12 h-12 mb-3" />
                <p className="text-sm">{isRTL ? 'لا توجد منتجات بعد' : 'No items yet'}</p>
                <p className="text-xs text-gray-700 mt-1">{isRTL ? 'انقر على منتج لإضافته' : 'Click a product to add it'}</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-800"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <Image
                      src={item.image}
                      alt={isRTL ? item.nameAr : item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {isRTL ? item.nameAr : item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(item.price, locale)} / {isRTL ? item.unitAr : item.unit}
                    </p>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Line total */}
                  <span className="text-sm font-bold text-green-400 w-20 text-end flex-shrink-0">
                    {formatPrice(item.price * item.quantity, locale)}
                  </span>
                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-lg hover:bg-red-600/20 text-gray-600 hover:text-red-400 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ── Payment Section ── */}
          <div className="border-t border-gray-800 bg-gray-900">
            {/* Totals */}
            <div className="px-4 py-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{isRTL ? 'ضريبة (17%)' : 'Tax (17%)'}</span>
                <span>{formatPrice(tax, locale)}</span>
              </div>
              {/* Discount */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{isRTL ? 'الخصم' : 'Discount'}</span>
                <div className="relative w-28">
                  <span className="absolute start-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">د.إ</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full ps-6 pe-2 py-1 rounded-md bg-gray-800 text-end text-red-400 border border-gray-700 focus:border-red-500 outline-none text-sm"
                  />
                </div>
              </div>
              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-lg font-bold text-white">{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className="text-2xl font-black text-green-400">{formatPrice(total, locale)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="px-4 pb-3">
              <p className="text-xs text-gray-500 mb-2">{isRTL ? 'طريقة الدفع' : 'Payment Method'}</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  {isRTL ? 'نقداً' : 'Cash'}
                </button>
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  {isRTL ? 'بطاقة' : 'Card'}
                </button>
                <button
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  {isRTL ? 'تحويل' : 'Transfer'}
                </button>
              </div>
            </div>

            {/* Cash: Amount Paid + Change */}
            {paymentMethod === 'CASH' && (
              <div className="px-4 pb-3 space-y-2">
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">د.إ</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder={isRTL ? 'المبلغ المدفوع' : 'Amount paid'}
                    value={amountPaid || ''}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full ps-8 pe-4 py-2.5 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-green-500 outline-none text-lg font-bold"
                  />
                </div>
                {amountPaid > 0 && (
                  <div className={`flex justify-between items-center px-3 py-2 rounded-lg ${change >= 0 ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                    <span className="text-sm">{isRTL ? 'الباقي' : 'Change'}</span>
                    <span className={`text-lg font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPrice(change, locale)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Complete Sale Button */}
            <div className="px-4 pb-4">
              <button
                onClick={handleCompleteSale}
                disabled={items.length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white font-bold text-lg shadow-lg shadow-green-600/30 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Receipt className="w-5 h-5" />
                {isRTL ? 'إتمام البيع (F9)' : 'Complete Sale (F9)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          RECEIPT MODAL
         ════════════════════════════════════════════════════════════════════════ */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Receipt Header */}
            <div className="text-center px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold">{isRTL ? 'بنيان لمواد البناء' : 'Bunyan Building Materials'}</h3>
              <p className="text-xs text-gray-500 mt-1">{isRTL ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
                <Hash className="w-3 h-3" />
                <span>{lastOrderNumber}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</p>
            </div>

            {/* Customer */}
            {(customerName || customerPhone) && (
              <div className="px-6 py-3 border-b border-gray-200 text-sm">
                {customerName && (
                  <p><span className="text-gray-500">{isRTL ? 'العميل:' : 'Customer:'}</span> {customerName}</p>
                )}
                {customerPhone && (
                  <p><span className="text-gray-500">{isRTL ? 'الهاتف:' : 'Phone:'}</span> {customerPhone}</p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="px-6 py-3 border-b border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-100">
                    <th className="text-start pb-2">{isRTL ? 'المنتج' : 'Item'}</th>
                    <th className="text-center pb-2">{isRTL ? 'الكمية' : 'Qty'}</th>
                    <th className="text-center pb-2">{isRTL ? 'السعر' : 'Price'}</th>
                    <th className="text-end pb-2">{isRTL ? 'المجموع' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-1.5 text-gray-800">{isRTL ? item.nameAr : item.name}</td>
                      <td className="py-1.5 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-1.5 text-center text-gray-600">{formatPrice(item.price, locale)}</td>
                      <td className="py-1.5 text-end font-medium">{formatPrice(item.price * item.quantity, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="px-6 py-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>{isRTL ? 'ضريبة (17%)' : 'Tax (17%)'}</span>
                <span>{formatPrice(tax, locale)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>{isRTL ? 'الخصم' : 'Discount'}</span>
                  <span>-{formatPrice(discount, locale)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-lg font-bold">
                <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className="text-green-600">{formatPrice(total, locale)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs">
                <span>{isRTL ? 'طريقة الدفع' : 'Payment'}</span>
                <span>
                  {paymentMethod === 'CASH'
                    ? isRTL ? 'نقداً' : 'Cash'
                    : paymentMethod === 'CARD'
                    ? isRTL ? 'بطاقة' : 'Card'
                    : isRTL ? 'تحويل بنكي' : 'Bank Transfer'}
                </span>
              </div>
              {paymentMethod === 'CASH' && amountPaid > 0 && (
                <>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>{isRTL ? 'المبلغ المدفوع' : 'Paid'}</span>
                    <span>{formatPrice(amountPaid, locale)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>{isRTL ? 'الباقي' : 'Change'}</span>
                    <span>{formatPrice(change, locale)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer message */}
            <div className="text-center px-6 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                {isRTL ? 'شكراً لتعاملكم معنا - بنيان لمواد البناء' : 'Thank you for your business - Bunyan Building Materials'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                <Printer className="w-4 h-4" />
                {isRTL ? 'طباعة' : 'Print'}
              </button>
              <button
                onClick={handleNewSale}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {isRTL ? 'فاتورة جديدة' : 'New Sale'}
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-12 flex items-center justify-center py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
