'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { orderSchema } from '@/lib/validations';
import Order from '@/models/Order';
import Product from '@/models/Product';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(data: unknown) {
  try {
    const validated = orderSchema.parse(data);
    await connectDB();

    // Calculate totals
    let subtotal = 0;
    for (const item of validated.items) {
      subtotal += item.price * item.quantity;

      // Update product stock
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = product.variants.find(
          (v: any) => v.size === item.size && v.color === item.color
        );
        if (variant && variant.stock >= item.quantity) {
          variant.stock -= item.quantity;
          await product.save();
        }
      }
    }

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shippingCost;

    let userId;
    try {
      const session = await requireAuth();
      userId = session.user.id;
    } catch {
      // Guest checkout
      userId = undefined;
    }

    const order = await Order.create({
      userId,
      orderNumber: generateOrderNumber(),
      items: validated.items,
      shippingAddress: validated.shippingAddress,
      paymentMethod: validated.paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
    });

    revalidatePath('/admin/orders');
    if (userId) {
      revalidatePath('/account/orders');
    }

    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  try {
    await requireAdmin();
    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { orderStatus: status } },
      { new: true }
    );

    if (!order) {
      return { error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
}) {
  try {
    await requireAdmin();
    await connectDB();

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (params?.status) {
      filter.orderStatus = params.status;
    }
    if (params?.userId) {
      filter.userId = params.userId;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      Order.countDocuments(filter),
    ]);

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getOrderById(orderId: string) {
  try {
    await connectDB();

    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .lean();

    if (!order) {
      return { error: 'Order not found' };
    }

    // Check authorization
    try {
      const session = await requireAuth();
      if (
        session.user.role !== 'admin' &&
        order.userId?.toString() !== session.user.id
      ) {
        return { error: 'Unauthorized' };
      }
    } catch {
      return { error: 'Unauthorized' };
    }

    return { order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserOrders() {
  try {
    const session = await requireAuth();
    await connectDB();

    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return { orders: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    await connectDB();

    const order = await Order.findOne({ orderNumber }).lean();

    if (!order) {
      return { error: 'Order not found' };
    }

    return { order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    return handleError(error);
  }
}

