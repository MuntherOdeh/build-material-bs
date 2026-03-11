import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categoryImages: Record<string, string> = {
  cement: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  steel: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&q=80',
  wood: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
  paint: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
  electrical: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80',
  plumbing: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
  tiles: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
  tools: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
  sand: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  insulation: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&q=80',
  glass: 'https://images.unsplash.com/photo-1596547609652-9cf5d8c76921?w=400&q=80',
  safety: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80',
};

const categoriesData = [
  { name: 'Cement & Concrete', nameAr: 'اسمنت وخرسانة', slug: 'cement-concrete', icon: 'Building2', imageKey: 'cement' },
  { name: 'Steel & Iron', nameAr: 'حديد وصلب', slug: 'steel-iron', icon: 'Anvil', imageKey: 'steel' },
  { name: 'Wood & Doors', nameAr: 'خشب وأبواب', slug: 'wood-doors', icon: 'DoorOpen', imageKey: 'wood' },
  { name: 'Paints & Colors', nameAr: 'دهانات وألوان', slug: 'paints-colors', icon: 'Paintbrush', imageKey: 'paint' },
  { name: 'Electrical & Lighting', nameAr: 'كهرباء وإنارة', slug: 'electrical-lighting', icon: 'Zap', imageKey: 'electrical' },
  { name: 'Plumbing & Sanitary', nameAr: 'سباكة وأدوات صحية', slug: 'plumbing-sanitary', icon: 'Droplets', imageKey: 'plumbing' },
  { name: 'Tiles & Ceramics', nameAr: 'بلاط وسيراميك', slug: 'tiles-ceramics', icon: 'LayoutGrid', imageKey: 'tiles' },
  { name: 'Tools & Equipment', nameAr: 'أدوات ومعدات', slug: 'tools-equipment', icon: 'Wrench', imageKey: 'tools' },
  { name: 'Sand & Gravel', nameAr: 'رمل وحصى', slug: 'sand-gravel', icon: 'Mountain', imageKey: 'sand' },
  { name: 'Insulation', nameAr: 'عزل', slug: 'insulation', icon: 'Shield', imageKey: 'insulation' },
  { name: 'Glass & Mirrors', nameAr: 'زجاج ومرايا', slug: 'glass-mirrors', icon: 'Maximize', imageKey: 'glass' },
  { name: 'Safety Equipment', nameAr: 'معدات السلامة', slug: 'safety-equipment', icon: 'HardHat', imageKey: 'safety' },
];

const productsData: Record<string, Array<{
  name: string; nameAr: string; sku: string; barcode: string;
  price: number; costPrice: number; unit: string; unitAr: string;
  stock: number; featured?: boolean;
}>> = {
  'cement-concrete': [
    { name: 'Portland Cement 50kg', nameAr: 'اسمنت بورتلاندي 50 كغم', sku: 'CEM-001', barcode: '5901234560001', price: 35, costPrice: 28, unit: 'bag', unitAr: 'كيس', stock: 500, featured: true },
    { name: 'White Cement 25kg', nameAr: 'اسمنت أبيض 25 كغم', sku: 'CEM-002', barcode: '5901234560002', price: 45, costPrice: 36, unit: 'bag', unitAr: 'كيس', stock: 200 },
    { name: 'Ready Mix Concrete', nameAr: 'خرسانة جاهزة', sku: 'CEM-003', barcode: '5901234560003', price: 450, costPrice: 380, unit: 'cubic meter', unitAr: 'متر مكعب', stock: 100 },
    { name: 'Cement Mortar 25kg', nameAr: 'ملاط اسمنتي 25 كغم', sku: 'CEM-004', barcode: '5901234560004', price: 28, costPrice: 22, unit: 'bag', unitAr: 'كيس', stock: 300 },
    { name: 'Self-Leveling Compound 20kg', nameAr: 'مادة تسوية ذاتية 20 كغم', sku: 'CEM-005', barcode: '5901234560005', price: 65, costPrice: 50, unit: 'bag', unitAr: 'كيس', stock: 150, featured: true },
  ],
  'steel-iron': [
    { name: 'Steel Rebar 12mm', nameAr: 'حديد تسليح 12 مم', sku: 'STL-001', barcode: '5901234560010', price: 18, costPrice: 14, unit: 'meter', unitAr: 'متر', stock: 2000, featured: true },
    { name: 'Steel Rebar 16mm', nameAr: 'حديد تسليح 16 مم', sku: 'STL-002', barcode: '5901234560011', price: 28, costPrice: 22, unit: 'meter', unitAr: 'متر', stock: 1500 },
    { name: 'Steel Mesh 2x3m', nameAr: 'شبك حديد 2×3 م', sku: 'STL-003', barcode: '5901234560012', price: 120, costPrice: 95, unit: 'sheet', unitAr: 'لوح', stock: 200 },
    { name: 'Iron Angle Bar 40x40mm', nameAr: 'زاوية حديد 40×40 مم', sku: 'STL-004', barcode: '5901234560013', price: 35, costPrice: 28, unit: 'meter', unitAr: 'متر', stock: 400 },
    { name: 'Steel Pipe 2 inch', nameAr: 'أنبوب حديد 2 بوصة', sku: 'STL-005', barcode: '5901234560014', price: 55, costPrice: 42, unit: 'meter', unitAr: 'متر', stock: 300 },
  ],
  'wood-doors': [
    { name: 'Plywood Sheet 18mm', nameAr: 'لوح خشب رقائقي 18 مم', sku: 'WOD-001', barcode: '5901234560020', price: 180, costPrice: 140, unit: 'sheet', unitAr: 'لوح', stock: 100, featured: true },
    { name: 'MDF Board 16mm', nameAr: 'لوح MDF 16 مم', sku: 'WOD-002', barcode: '5901234560021', price: 150, costPrice: 115, unit: 'sheet', unitAr: 'لوح', stock: 120 },
    { name: 'Interior Wooden Door', nameAr: 'باب خشبي داخلي', sku: 'WOD-003', barcode: '5901234560022', price: 450, costPrice: 350, unit: 'piece', unitAr: 'قطعة', stock: 40 },
    { name: 'Wooden Beams 10x10cm', nameAr: 'عوارض خشبية 10×10 سم', sku: 'WOD-004', barcode: '5901234560023', price: 45, costPrice: 35, unit: 'meter', unitAr: 'متر', stock: 200 },
    { name: 'Door Frame Set', nameAr: 'طقم إطار باب', sku: 'WOD-005', barcode: '5901234560024', price: 120, costPrice: 90, unit: 'set', unitAr: 'طقم', stock: 60, featured: true },
  ],
  'paints-colors': [
    { name: 'Interior Wall Paint White 18L', nameAr: 'دهان جدران داخلي أبيض 18 لتر', sku: 'PNT-001', barcode: '5901234560030', price: 220, costPrice: 170, unit: 'bucket', unitAr: 'سطل', stock: 150, featured: true },
    { name: 'Exterior Paint 18L', nameAr: 'دهان خارجي 18 لتر', sku: 'PNT-002', barcode: '5901234560031', price: 280, costPrice: 220, unit: 'bucket', unitAr: 'سطل', stock: 100 },
    { name: 'Primer Coat 4L', nameAr: 'طبقة أساس 4 لتر', sku: 'PNT-003', barcode: '5901234560032', price: 65, costPrice: 48, unit: 'can', unitAr: 'علبة', stock: 200 },
    { name: 'Wood Varnish 1L', nameAr: 'ورنيش خشب 1 لتر', sku: 'PNT-004', barcode: '5901234560033', price: 45, costPrice: 32, unit: 'can', unitAr: 'علبة', stock: 180 },
    { name: 'Spray Paint 400ml', nameAr: 'بخاخ دهان 400 مل', sku: 'PNT-005', barcode: '5901234560034', price: 25, costPrice: 18, unit: 'can', unitAr: 'علبة', stock: 300 },
    { name: 'Waterproof Paint 10L', nameAr: 'دهان مقاوم للماء 10 لتر', sku: 'PNT-006', barcode: '5901234560035', price: 190, costPrice: 150, unit: 'bucket', unitAr: 'سطل', stock: 80 },
  ],
  'electrical-lighting': [
    { name: 'LED Panel Light 60x60', nameAr: 'لوحة إضاءة LED 60×60', sku: 'ELC-001', barcode: '5901234560040', price: 85, costPrice: 60, unit: 'piece', unitAr: 'قطعة', stock: 200, featured: true },
    { name: 'Electrical Wire 2.5mm Roll', nameAr: 'سلك كهربائي 2.5 مم رول', sku: 'ELC-002', barcode: '5901234560041', price: 120, costPrice: 90, unit: 'roll', unitAr: 'لفة', stock: 300 },
    { name: 'Distribution Board 12 Way', nameAr: 'لوحة توزيع 12 طريقة', sku: 'ELC-003', barcode: '5901234560042', price: 180, costPrice: 135, unit: 'piece', unitAr: 'قطعة', stock: 50 },
    { name: 'Light Switch', nameAr: 'مفتاح إنارة', sku: 'ELC-004', barcode: '5901234560043', price: 15, costPrice: 9, unit: 'piece', unitAr: 'قطعة', stock: 500 },
    { name: 'Power Outlet Double', nameAr: 'مقبس كهربائي مزدوج', sku: 'ELC-005', barcode: '5901234560044', price: 18, costPrice: 11, unit: 'piece', unitAr: 'قطعة', stock: 400 },
    { name: 'LED Bulb 12W', nameAr: 'لمبة LED 12 واط', sku: 'ELC-006', barcode: '5901234560045', price: 12, costPrice: 7, unit: 'piece', unitAr: 'قطعة', stock: 800 },
  ],
  'plumbing-sanitary': [
    { name: 'PVC Pipe 4 inch 3m', nameAr: 'أنبوب PVC 4 بوصة 3 م', sku: 'PLB-001', barcode: '5901234560050', price: 45, costPrice: 32, unit: 'piece', unitAr: 'قطعة', stock: 200 },
    { name: 'Water Heater 50L', nameAr: 'سخان مياه 50 لتر', sku: 'PLB-002', barcode: '5901234560051', price: 650, costPrice: 500, unit: 'piece', unitAr: 'قطعة', stock: 30, featured: true },
    { name: 'Kitchen Faucet', nameAr: 'حنفية مطبخ', sku: 'PLB-003', barcode: '5901234560052', price: 180, costPrice: 130, unit: 'piece', unitAr: 'قطعة', stock: 60 },
    { name: 'Toilet Set Complete', nameAr: 'طقم حمام كامل', sku: 'PLB-004', barcode: '5901234560053', price: 850, costPrice: 650, unit: 'set', unitAr: 'طقم', stock: 20 },
    { name: 'Bathroom Sink', nameAr: 'مغسلة حمام', sku: 'PLB-005', barcode: '5901234560054', price: 250, costPrice: 180, unit: 'piece', unitAr: 'قطعة', stock: 40 },
  ],
  'tiles-ceramics': [
    { name: 'Ceramic Floor Tile 60x60', nameAr: 'بلاط أرضي سيراميك 60×60', sku: 'TIL-001', barcode: '5901234560060', price: 55, costPrice: 40, unit: 'sqm', unitAr: 'متر مربع', stock: 500, featured: true },
    { name: 'Porcelain Tile 80x80', nameAr: 'بلاط بورسلان 80×80', sku: 'TIL-002', barcode: '5901234560061', price: 85, costPrice: 62, unit: 'sqm', unitAr: 'متر مربع', stock: 400 },
    { name: 'Wall Tile 30x60 White', nameAr: 'بلاط جدران 30×60 أبيض', sku: 'TIL-003', barcode: '5901234560062', price: 42, costPrice: 30, unit: 'sqm', unitAr: 'متر مربع', stock: 600 },
    { name: 'Mosaic Tile Sheet', nameAr: 'بلاط موزاييك', sku: 'TIL-004', barcode: '5901234560063', price: 120, costPrice: 85, unit: 'sqm', unitAr: 'متر مربع', stock: 150 },
    { name: 'Tile Adhesive 25kg', nameAr: 'لاصق بلاط 25 كغم', sku: 'TIL-005', barcode: '5901234560064', price: 35, costPrice: 25, unit: 'bag', unitAr: 'كيس', stock: 400 },
    { name: 'Tile Grout 5kg', nameAr: 'مادة حشو بلاط 5 كغم', sku: 'TIL-006', barcode: '5901234560065', price: 22, costPrice: 15, unit: 'bag', unitAr: 'كيس', stock: 350 },
  ],
  'tools-equipment': [
    { name: 'Power Drill 750W', nameAr: 'مثقاب كهربائي 750 واط', sku: 'TOL-001', barcode: '5901234560070', price: 280, costPrice: 210, unit: 'piece', unitAr: 'قطعة', stock: 40, featured: true },
    { name: 'Angle Grinder 125mm', nameAr: 'جلاخة زاوية 125 مم', sku: 'TOL-002', barcode: '5901234560071', price: 220, costPrice: 165, unit: 'piece', unitAr: 'قطعة', stock: 35 },
    { name: 'Measuring Tape 5m', nameAr: 'شريط قياس 5 م', sku: 'TOL-003', barcode: '5901234560072', price: 18, costPrice: 10, unit: 'piece', unitAr: 'قطعة', stock: 200 },
    { name: 'Spirit Level 60cm', nameAr: 'ميزان ماء 60 سم', sku: 'TOL-004', barcode: '5901234560073', price: 35, costPrice: 22, unit: 'piece', unitAr: 'قطعة', stock: 80 },
    { name: 'Wheelbarrow', nameAr: 'عربة يدوية', sku: 'TOL-005', barcode: '5901234560074', price: 150, costPrice: 110, unit: 'piece', unitAr: 'قطعة', stock: 25 },
  ],
  'sand-gravel': [
    { name: 'Building Sand (ton)', nameAr: 'رمل بناء (طن)', sku: 'SND-001', barcode: '5901234560080', price: 180, costPrice: 130, unit: 'ton', unitAr: 'طن', stock: 100, featured: true },
    { name: 'Washed Sand (ton)', nameAr: 'رمل مغسول (طن)', sku: 'SND-002', barcode: '5901234560081', price: 200, costPrice: 150, unit: 'ton', unitAr: 'طن', stock: 80 },
    { name: 'Gravel 20mm (ton)', nameAr: 'حصى 20 مم (طن)', sku: 'SND-003', barcode: '5901234560082', price: 160, costPrice: 120, unit: 'ton', unitAr: 'طن', stock: 120 },
    { name: 'Crushed Stone (ton)', nameAr: 'حجر مكسر (طن)', sku: 'SND-004', barcode: '5901234560083', price: 140, costPrice: 100, unit: 'ton', unitAr: 'طن', stock: 150 },
    { name: 'Decorative Pebbles 25kg', nameAr: 'حصى ديكور 25 كغم', sku: 'SND-005', barcode: '5901234560084', price: 45, costPrice: 30, unit: 'bag', unitAr: 'كيس', stock: 200 },
  ],
  'insulation': [
    { name: 'Foam Board 5cm', nameAr: 'لوح فوم 5 سم', sku: 'INS-001', barcode: '5901234560090', price: 35, costPrice: 25, unit: 'sqm', unitAr: 'متر مربع', stock: 300 },
    { name: 'Rock Wool Roll 50mm', nameAr: 'صوف صخري رول 50 مم', sku: 'INS-002', barcode: '5901234560091', price: 55, costPrice: 40, unit: 'sqm', unitAr: 'متر مربع', stock: 200, featured: true },
    { name: 'Waterproofing Membrane', nameAr: 'غشاء عزل مائي', sku: 'INS-003', barcode: '5901234560092', price: 28, costPrice: 18, unit: 'sqm', unitAr: 'متر مربع', stock: 500 },
    { name: 'Thermal Insulation Tape', nameAr: 'شريط عزل حراري', sku: 'INS-004', barcode: '5901234560093', price: 15, costPrice: 8, unit: 'roll', unitAr: 'لفة', stock: 400 },
    { name: 'Bitumen Roll 1x10m', nameAr: 'رول بيتومين 1×10 م', sku: 'INS-005', barcode: '5901234560094', price: 85, costPrice: 60, unit: 'roll', unitAr: 'لفة', stock: 100 },
  ],
  'glass-mirrors': [
    { name: 'Clear Glass 6mm', nameAr: 'زجاج شفاف 6 مم', sku: 'GLS-001', barcode: '5901234560100', price: 60, costPrice: 42, unit: 'sqm', unitAr: 'متر مربع', stock: 150 },
    { name: 'Tempered Glass 10mm', nameAr: 'زجاج مقسى 10 مم', sku: 'GLS-002', barcode: '5901234560101', price: 140, costPrice: 100, unit: 'sqm', unitAr: 'متر مربع', stock: 80, featured: true },
    { name: 'Mirror 4mm', nameAr: 'مرآة 4 مم', sku: 'GLS-003', barcode: '5901234560102', price: 75, costPrice: 50, unit: 'sqm', unitAr: 'متر مربع', stock: 100 },
    { name: 'Double Glazed Unit', nameAr: 'وحدة زجاج مزدوج', sku: 'GLS-004', barcode: '5901234560103', price: 220, costPrice: 165, unit: 'sqm', unitAr: 'متر مربع', stock: 50 },
    { name: 'Frosted Glass 6mm', nameAr: 'زجاج مصنفر 6 مم', sku: 'GLS-005', barcode: '5901234560104', price: 90, costPrice: 65, unit: 'sqm', unitAr: 'متر مربع', stock: 70 },
  ],
  'safety-equipment': [
    { name: 'Safety Helmet', nameAr: 'خوذة سلامة', sku: 'SAF-001', barcode: '5901234560110', price: 35, costPrice: 22, unit: 'piece', unitAr: 'قطعة', stock: 200, featured: true },
    { name: 'Safety Vest Reflective', nameAr: 'سترة سلامة عاكسة', sku: 'SAF-002', barcode: '5901234560111', price: 25, costPrice: 15, unit: 'piece', unitAr: 'قطعة', stock: 300 },
    { name: 'Work Gloves Heavy Duty', nameAr: 'قفازات عمل شديدة التحمل', sku: 'SAF-003', barcode: '5901234560112', price: 18, costPrice: 10, unit: 'pair', unitAr: 'زوج', stock: 500 },
    { name: 'Safety Goggles', nameAr: 'نظارات سلامة', sku: 'SAF-004', barcode: '5901234560113', price: 22, costPrice: 12, unit: 'piece', unitAr: 'قطعة', stock: 250 },
    { name: 'Safety Boots Size 42', nameAr: 'حذاء سلامة مقاس 42', sku: 'SAF-005', barcode: '5901234560114', price: 180, costPrice: 130, unit: 'pair', unitAr: 'زوج', stock: 60 },
  ],
};

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data in correct order
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();
  console.log('✅ Cleared existing data');

  // Create categories
  console.log('📁 Creating categories...');
  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        nameAr: cat.nameAr,
        slug: cat.slug,
        icon: cat.icon,
        image: categoryImages[cat.imageKey],
      },
    });
    categoryMap[cat.slug] = category.id;
    console.log(`  ✅ Created category: ${cat.name}`);
  }

  // Create products for each category
  console.log('📦 Creating products...');
  let productCount = 0;

  for (const [slug, products] of Object.entries(productsData)) {
    const categoryId = categoryMap[slug];
    const imageKey = categoriesData.find((c) => c.slug === slug)!.imageKey;
    const image = categoryImages[imageKey];

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          nameAr: product.nameAr,
          sku: product.sku,
          barcode: product.barcode,
          price: product.price,
          costPrice: product.costPrice,
          unit: product.unit,
          unitAr: product.unitAr,
          stock: product.stock,
          image,
          categoryId,
          featured: product.featured || false,
          active: true,
        },
      });
      productCount++;
    }
    console.log(`  ✅ Created ${products.length} products for ${slug}`);
  }

  console.log(`📦 Total products created: ${productCount}`);

  // Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bunyan.com',
      password: hashedPassword,
      name: 'Admin',
      nameAr: 'مدير',
      role: 'ADMIN',
      phone: '+972-50-000-0000',
    },
  });
  console.log(`  ✅ Created admin user: ${admin.email}`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
