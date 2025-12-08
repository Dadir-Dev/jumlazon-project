import { cart } from "../data/cartData.js";
import { products } from "../data/products.js";

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
  console.log(cart);
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
}

export function getCartDetails() {
  return cart.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    return {
      ...cartItem,
      product: product ? { ...product } : null,
    };
  });
}

export function updateQuantity(productId, change) {
  const item = cart.find((item) => item.productId === productId);
  if (!item) return;

  if (change === 1) {
    item.quantity++;
  } else if (change === -1 && item.quantity > 1) {
    item.quantity--;
  }
}

export function getCartTotalPrice() {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}
