'use server';

import { revalidatePath } from 'next/cache';
import { addToCart, updateCartItem, removeFromCart, clearCart, getCart } from '@/lib/cart';
import type { CartItem } from '@/lib/cart';
import { handleError } from '@/lib/errors';

export async function addToCartAction(item: CartItem) {
  try {
    const cart = await addToCart(item);
    revalidatePath('/cart');
    return { success: true, cart };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCartItemAction(
  productId: string,
  size: string,
  color: string,
  quantity: number
) {
  try {
    const cart = await updateCartItem(productId, size, color, quantity);
    revalidatePath('/cart');
    return { success: true, cart };
  } catch (error) {
    return handleError(error);
  }
}

export async function removeFromCartAction(
  productId: string,
  size: string,
  color: string
) {
  try {
    const cart = await removeFromCart(productId, size, color);
    revalidatePath('/cart');
    return { success: true, cart };
  } catch (error) {
    return handleError(error);
  }
}

export async function clearCartAction() {
  try {
    await clearCart();
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCartAction() {
  try {
    const cart = await getCart();
    return { success: true, cart };
  } catch (error) {
    return handleError(error);
  }
}

