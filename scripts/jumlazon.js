import {
  addToCart,
  getCartDetails,
  getCartQuantity,
  removeFromCart,
  updateQuantity,
} from "./cart.js";
import { initProducts } from "./products.js";
import { renderCart, renderCartQuantity } from "./cartUI.js";
import {
  initCheckout,
  saveAndProceed,
  navigateCheckoutStep,
} from "./checkout.js";

// ===== GLOBAL DOM Elements =====
const productsContainer = document.querySelector("[data-products-container]");
const cartItemsContainer = document.querySelector(
  "[data-cart-items-container]"
);
const cartTotalElement = document.querySelector("[data-cart-total]");
const cartCountElement = document.querySelector("[data-cart-quantity]");

// ===== INITIALIZE PAGE =====
function init() {
  if (!productsContainer) {
    console.error("[data-products-container] not found");
    return;
  }

  initProducts(productsContainer, (id, qty) => {
    addToCart(id, qty);
    updateCart();
  });
  updateCart();
  initCartListeners();
  initCheckoutEventListeners();
  initCartToggle();

  // Close checkout modal
  const closeCheckoutBtn = document.getElementById("closeCheckout");
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
      document.getElementById("checkoutModal").classList.add("hidden");
    });
  }

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("checkoutModal").classList.add("hidden");
    }
  });
}

// ===== CART UPDATE =====
function updateCart() {
  renderCartQuantity(cartCountElement, getCartQuantity());

  if (!cartItemsContainer || !cartTotalElement) {
    console.warn("Cart container elements not found for renderCart");
    return;
  }

  const cartDetails = getCartDetails();
  renderCart(cartItemsContainer, cartTotalElement, cartDetails);
}

// ===== CART LISTENERS =====
function initCartListeners() {
  // Increase / Decrease / Remove
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-increase-quantity]");
      const dec = e.target.closest("[data-decrease-quantity]");
      const rm = e.target.closest("[data-remove-item]");

      if (inc) updateQuantity(Number(inc.dataset.productId), +1);
      if (dec) updateQuantity(Number(dec.dataset.productId), -1);
      if (rm) removeFromCart(Number(rm.dataset.productId));

      updateCart();
    });
  }
}

// ===== CHECKOUT UI LISTENERS =====
function initCheckoutEventListeners() {
  document.body.addEventListener("click", (e) => {
    const checkoutBtn = e.target.closest("[data-checkout-button]");
    if (checkoutBtn) {
      openCheckoutModal();
    }

    const nextStepBtn = e.target.closest("[data-next-step]");
    const prevStepBtn = e.target.closest("[data-prev-step]");

    if (nextStepBtn) {
      const nextStep = nextStepBtn.dataset.nextStep;
      // Find the current form
      const form = document.querySelector("[data-checkout-form]");
      const currentStep = form?.dataset.checkoutForm;
      if (currentStep) {
        saveAndProceed(e, currentStep, nextStep, form);
      } else {
        navigateCheckoutStep(nextStep);
      }
    }

    if (prevStepBtn) {
      const step = prevStepBtn.dataset.prevStep;
      navigateCheckoutStep(step);
    }
  });
}

// ===== OPEN CHECKOUT MODAL =====
function openCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  const cartContainer = document.getElementById("cartContainer");

  if (!modal) return;

  // Close cart if open
  if (cartContainer) {
    cartContainer.classList.add("hidden");
  }

  // Show checkout
  modal.classList.remove("hidden");
  initCheckout();
}

// Note: checkout navigation and step indicator live in `checkout.js`.

// // ===== Initialization =====

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
