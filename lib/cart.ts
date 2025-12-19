import { cookies } from 'next/headers';

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  stock: number;
}

const CART_COOKIE = 'cart';

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE);
  
  if (!cartCookie) {
    return [];
  }

  try {
    return JSON.parse(cartCookie.value);
  } catch {
    return [];
  }
}

export async function addToCart(item: CartItem): Promise<CartItem[]> {
  const cart = await getCart();
  
  const existingItemIndex = cart.findIndex(
    (i) =>
      i.productId === item.productId &&
      i.size === item.size &&
      i.color === item.color
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity;
    
    // Ensure quantity doesn't exceed stock
    if (cart[existingItemIndex].quantity > cart[existingItemIndex].stock) {
      cart[existingItemIndex].quantity = cart[existingItemIndex].stock;
    }
  } else {
    cart.push(item);
  }

  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return cart;
}

export async function updateCartItem(
  productId: string,
  size: string,
  color: string,
  quantity: number
): Promise<CartItem[]> {
  const cart = await getCart();
  
  const itemIndex = cart.findIndex(
    (i) =>
      i.productId === productId &&
      i.size === size &&
      i.color === color
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = Math.min(quantity, cart[itemIndex].stock);
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return cart;
}

export async function removeFromCart(
  productId: string,
  size: string,
  color: string
): Promise<CartItem[]> {
  const cart = await getCart();
  
  const filteredCart = cart.filter(
    (i) =>
      !(
        i.productId === productId &&
        i.size === size &&
        i.color === color
      )
  );

  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(filteredCart), {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return filteredCart;
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

export function calculateCartTotal(cart: CartItem[]): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

