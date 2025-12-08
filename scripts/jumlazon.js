import { products } from "../data/products.js";
import { cart } from "../data/cartData.js";
import {
  addToCart,
  getCartDetails,
  removeFromCart,
  updateQuantity,
} from "./cart.js";
import { renderProducts } from "./products.js";
import { renderCart } from "./cartUI.js";

const cartItemsContainer = document.querySelector(
  "[data-cart-items-container]"
);
const cartTotalElement = document.querySelector("[data-cart-total]");

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

  if (!cartItemsContainer) {
    console.error("[data-cart-items-container] not found");
    return;
  }

  document.body.addEventListener("click", (e) => {
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

  if (!cartItemsContainer || !cartTotalElement) {
    console.warn("Cart container elements not found for renderCart");
    return;
  }

  const cartDetails = getCartDetails();
  renderCart(cartItemsContainer, cartTotalElement, cartDetails);
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
