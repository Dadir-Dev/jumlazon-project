import { cart } from "../data/cartData.js";
import { products } from "../data/products.js";

// ===== Cart Management Functions =====
const CART_STORAGE_KEY = "jumlazon_cart_v1";

export function saveCartToLocalStorage(storage = globalThis.localStorage) {
  storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartData) return;
  try {
    const parsedCart = JSON.parse(cartData);
    if (Array.isArray(parsedCart)) {
      // Clear current cart and load from storage
      cart.length = 0;
      cart.push(...parsedCart);
    }
  } catch (e) {
    console.error("Failed to parse cart data from localStorage", e);
  }
}

export function initCart() {
  loadCartFromLocalStorage();
}

export function addToCart(productId, dropdownquantity = 1) {
  // Ensure quantity is a valid number
  const quantity = Number(dropdownquantity);
  if (isNaN(quantity) || quantity <= 0) {
    console.warn(`Invalid quantity: ${quantity}`);
    return;
  }

  // Check if product is already in cart
  const matchingItem = cart.find((item) => item.productId === productId);

  // If it is, increment quantity
  if (matchingItem) {
    matchingItem.quantity += quantity;
  }
  // If it's not, add it to the cart
  else {
    cart.push({
      productId,
      quantity,
    });
  }
  saveCartToLocalStorage();
}

export function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.productId === productId);
  if (index === -1) {
    console.warn(
      `Attempted to remove product ${productId} but it was not found in cart`
    );
    return;
  }
  cart.splice(index, 1);
  saveCartToLocalStorage();
}

// Get cart details with product information
export function getCartDetails() {
  return cart.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    return {
      ...cartItem,
      product: product ? { ...product } : null,
    };
  });
}

// change = 1 or -1
export function updateQuantity(productId, change) {
  const item = cart.find((item) => item.productId === productId);
  if (!item) return;

  if (change === 1) {
    item.quantity++;
  } else if (change === -1 && item.quantity > 1) {
    item.quantity--;
  }

  saveCartToLocalStorage();
}

export function getCartTotalPrice() {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

// Get total quantity of items in cart
export function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function addToCartPure(cart, productId, quantity) {
  const matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    return cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...cart, { productId, quantity }];
}

export function removeFromCartPure(cart, productId) {
  return cart.filter((item) => item.productId !== productId);
}

export function updateQuantityPure(cart, productId, change) {
  return cart.map((item) => {
    if (item.productId !== productId) return item;

    const newQuantity = item.quantity + change;
    return {
      ...item,
      quantity: newQuantity < 1 ? 1 : newQuantity,
    };
  });
}

function getCartQuantityPure(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartFromStorage() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function getCartTotalPricePure(cart, product) {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}
