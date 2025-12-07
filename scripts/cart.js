import { cart } from "../data/cartData.js";
import { products } from "../data/products.js";

export function addToCart(productId, dropdownquantity) {
  // Check if product is already in cart
  const matchingItem = cart.find((item) => item.productId === productId);
  // If it is, increment quantity
  const quantity = Number(dropdownquantity);
  if (quantity <= 0) return;
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

export function getCartDetails() {
  return cart.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    return {
      ...cartItem,
      product: product ? { ...product } : null,
    };
  });
}
