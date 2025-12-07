import { products } from "../data/products.js";
import { cart } from "../data/cartData.js";
import {
  addToCart,
  getCartDetails,
  removeFromCart,
  updateQuantity,
} from "./cart.js";
import { renderProducts } from "./products.js";

// ===== Initialization & Add to Cart (event delegation) =====
function init() {
  const productsContainer = document.querySelector("[data-products-container]");
  if (!productsContainer) {
    console.error("[data-products-container] not found");
    return;
  }

  renderProducts(productsContainer);
  updateCart();
  initCartToggle();

  // Store all timeouts here (outside the event listener)
  const addedMessageTimeouts = {};

  // SINGLE event listener for ALL add-to-cart buttons (current and future)
  productsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn || !productsContainer.contains(btn)) return;

    const id = Number(btn.dataset.productId);
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const dropdownQuantity = document.querySelector(
      `[data-dropwdown-quantity-${id}]`
    ).value;
    addToCart(id, dropdownQuantity);
    updateCart();
    // show added to cart message
    // query from the button's parent/card container instead of from the button itself.

    const card = btn.closest(".p-4") || btn.parentElement;
    const addedMsg = card && card.querySelector(`[data-added-message-${id}]`);
    if (addedMsg) {
      // // If timeout exists, clear it first
      if (addedMessageTimeouts[id]) {
        clearTimeout(addedMessageTimeouts[id]);
        addedMessageTimeouts[id] = null;
      }
      // show the message
      addedMsg.classList.remove("opacity-0");

      // Set a new timeout to hide the message after 1 second
      addedMessageTimeouts[id] = setTimeout(() => {
        addedMsg.classList.add("opacity-0");
      }, 1000);
    } else {
      console.warn(`added message element for product ${id} not found`);
    }
  });

  // Increase/Decrease quantity buttons in cart
  const cartItemsContainer = document.querySelector(
    "[data-cart-items-container]"
  );
  if (!cartItemsContainer) {
    console.error("[data-cart-items-container] not found");
    return;
  }

  cartItemsContainer.addEventListener("click", (e) => {
    const increaseBtn = e.target.closest("[data-increase-quantity]");
    const decreaseBtn = e.target.closest("[data-decrease-quantity]");
    if (!increaseBtn && !decreaseBtn) return;

    const id = Number(
      increaseBtn
        ? increaseBtn.dataset.productId
        : decreaseBtn.dataset.productId
    );
    updateQuantity(id, increaseBtn ? 1 : -1);
    updateCart();
  });

  // Remove item from cart
  cartItemsContainer.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-item]");
    if (!removeBtn) return;

    const id = Number(removeBtn.dataset.productId);
    removeFromCart(id);
    updateCart();
  });
}

function renderCartQuantity() {
  const cartCountElement = document.querySelector("[data-cart-quantity]");
  if (!cartCountElement) {
    console.error("[data-cart-quantity] not found");
    return; // Exit if element not found
  }
  const TotalcartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = TotalcartQuantity;
}

// Update your updateCart function
function updateCart() {
  renderCartQuantity();
  renderCart();
}

// // ===== Initialization =====
// updateCartCount();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Mobile search toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector(".js-search-toggle");
  const mobileSearch = document.getElementById("mobileSearch");

  searchButton.addEventListener("click", function () {
    mobileSearch.classList.toggle("hidden");
  });
});

// ===== Cart =====

function renderCart() {
  const cartItemsContainer = document.querySelector(
    "[data-cart-items-container]"
  );

  const cartTotalElement = document.querySelector("[data-cart-total]");

  if (!cartItemsContainer || !cartTotalElement) {
    console.warn("Cart container element is not found");
    return;
  }

  const cartDetails = getCartDetails();

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

  console.log(cartItemsContainer);
}

// Add cart toggle functionality
function initCartToggle() {
  const cartButton = document.querySelector("[data-cart-toggle]");
  const closeCartButton = document.getElementById("closeCart");
  const cartContainer = document.getElementById("cartContainer");
  const cartOverlay = document.getElementById("cartOverlay");

  if (!cartButton || !cartContainer) return;

  cartButton.addEventListener("click", () => {
    cartContainer.classList.remove("hidden");
    if (cartOverlay) cartOverlay.classList.remove("hidden");
  });

  closeCartButton.addEventListener("click", () => {
    cartContainer.classList.add("hidden");
    if (cartOverlay) cartOverlay.classList.add("hidden");
  });

  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
      cartContainer.classList.add("hidden");
      cartOverlay.classList.add("hidden");
    });
  }
}
