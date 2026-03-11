import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [sales, summary] = await Promise.all([
      prisma.order.findMany({
        where: {
          type: 'POS',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, nameAr: true, sku: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.aggregate({
        where: {
          type: 'POS',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: { total: true },
        _count: { id: true },
      }),
    ]);

    return NextResponse.json({
      sales,
      summary: {
        totalAmount: summary._sum.total || 0,
        orderCount: summary._count.id || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching POS sales:', error);
    return NextResponse.json({ error: 'Failed to fetch POS sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customerName,
      customerPhone,
      discount = 0,
      tax = 0,
      notes,
      paymentMethod = 'CASH',
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Sale must have at least one item' }, { status: 400 });
    }

    // Fetch products to verify prices and stock
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate stock availability
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.productId)!;
      const price = product.salePrice || product.price;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const total = subtotal + tax - discount;

    // Create POS sale and update stock in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          type: 'POS',
          status: 'CONFIRMED',
          customerName,
          customerPhone,
          subtotal,
          tax,
          discount,
          total,
          notes,
          paymentMethod,
          paidAt: new Date(),
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, nameAr: true, sku: true } },
            },
          },
        },
      });

      // Update stock for each product
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error creating POS sale:', error);
    return NextResponse.json({ error: 'Failed to create POS sale' }, { status: 500 });
  }
}
