'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { orderSchema } from '@/lib/validations';
import { toCamelCase, toSnakeCase } from '@/lib/db-helpers';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(data: unknown) {
  try {
    const validated = orderSchema.parse(data);
    const supabase = await connectDB();

    // Calculate totals
    let subtotal = 0;
    for (const item of validated.items) {
      subtotal += item.price * item.quantity;

      // Update product stock
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('variants')
        .eq('id', item.productId)
        .single();

      if (product && !productError) {
        const variants = product.variants as Array<{ size: string; color: string; stock: number }>;
        const variant = variants.find(
          (v) => v.size === item.size && v.color === item.color
        );
        if (variant && variant.stock >= item.quantity) {
          variant.stock -= item.quantity;
          // Update the product with new variants
          await supabase
            .from('products')
            .update({ variants })
            .eq('id', item.productId);
        }
      }
    }

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shippingCost;

    let userId: string | undefined;
    try {
      const session = await requireAuth();
      userId = session.user.id;
    } catch {
      // Guest checkout
      userId = undefined;
    }

    const orderData = {
      user_id: userId || null,
      order_number: generateOrderNumber(),
      items: validated.items,
      shipping_address: validated.shippingAddress,
      payment_method: validated.paymentMethod,
      subtotal,
      tax,
      shipping_cost: shippingCost,
      total,
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/admin/orders');
    if (userId) {
      revalidatePath('/account/orders');
    }

    return { success: true, order: toCamelCase(order) };
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
    const supabase = await connectDB();

    const { data: order, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    if (!order) {
      return { error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true, order: toCamelCase(order) };
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
    const supabase = await connectDB();

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('orders')
      .select('*, users!orders_user_id_fkey(id, name, email)', { count: 'exact' });

    if (params?.status) {
      query = query.eq('order_status', params.status);
    }
    if (params?.userId) {
      query = query.eq('user_id', params.userId);
    }

    query = query.order('created_at', { ascending: false });

    const { data: orders, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      orders: orders ? orders.map(toCamelCase) : [],
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getOrderById(orderId: string) {
  try {
    const supabase = await connectDB();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, users!orders_user_id_fkey(id, name, email)')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    if (!order) {
      return { error: 'Order not found' };
    }

    // Check authorization
    try {
      const session = await requireAuth();
      if (
        session.user.role !== 'admin' &&
        order.user_id !== session.user.id
      ) {
        return { error: 'Unauthorized' };
      }
    } catch {
      return { error: 'Unauthorized' };
    }

    return { order: toCamelCase(order) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserOrders() {
  try {
    const session = await requireAuth();
    const supabase = await connectDB();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { orders: orders ? orders.map(toCamelCase) : [] };
  } catch (error) {
    return handleError(error);
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    const supabase = await connectDB();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error) throw error;
    if (!order) {
      return { error: 'Order not found' };
    }

    return { order: toCamelCase(order) };
  } catch (error) {
    return handleError(error);
  }
}
