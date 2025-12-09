import { cart } from "../data/cartData.js";
export function renderCart(cartItemsContainer, cartTotalElement, cartDetails) {
  // If cart is empty
  if (cartDetails.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        Your cart is empty.
      </div>
    `;
    cartTotalElement.textContent = "$0.00";
    return;
  }

  // Calculate total price
  let totalPrice = 0;

  // Render each cart item
  cartItemsContainer.innerHTML = cartDetails
    .map((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalPrice += itemTotal;

      return `
        <div class="flex items-center border-b pb-4" data-cart-item-id="${
          item.productId
        }">
          <img 
            src="${item.product.image}" 
            alt="${item.product.name}" 
            class="w-20 h-20 object-contain mr-4"
          >
          <div class="flex-1">
            <h4 class="font-medium">${item.product.name}</h4>
            <p class="text-gray-600">$${item.product.price.toFixed(2)}</p>
            <div class="flex items-center mt-2">
              <button class="px-3 py-1 border rounded-l" data-decrease-quantity data-product-id="${
                item.productId
              }" aria-label="Decrease quantity of ${
        item.product.name
      }">-</button>
              <span class="px-4 py-1 border-t border-b">${item.quantity}</span>
              <button class="px-3 py-1 border rounded-r" data-increase-quantity data-product-id="${
                item.productId
              }" aria-label="Increase quantity of ${
        item.product.name
      }">+</button>
              <button class="ml-4 text-red-600 hover:text-red-800" data-remove-item data-product-id="${
                item.productId
              }">Remove</button>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold">$${itemTotal.toFixed(2)}</p>
          </div>
        </div>
      `;
    })
    .join("");

  // Update total price
  cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;

  // Show checkout button if cart is not empty
  const checkoutButton = document.querySelector("[data-checkout]");
  if (checkoutButton) {
    checkoutButton.classList.remove("hidden");
  }
}

// Cart quantity display
export function renderCartQuantity(cartCountElement) {
  if (!cartCountElement) {
    console.error("[data-cart-quantity] not found");
    return;
  }
  const TotalcartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = TotalcartQuantity;
}
