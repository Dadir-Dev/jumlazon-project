import { products } from "../data/products.js";
import {
  addToCart,
  getCartDetails,
  removeFromCart,
  updateQuantity,
} from "./cart.js";
import { renderProducts } from "./products.js";
import { renderCart, renderCartQuantity } from "./cartUI.js";
import {
  initCheckout,
  renderShippingStep,
  renderPaymentStep,
  renderReviewStep,
} from "./checkout.js";

// ===== DOM Elements =====
const productsContainer = document.querySelector("[data-products-container]");
const cartItemsContainer = document.querySelector(
  "[data-cart-items-container]"
);
const cartTotalElement = document.querySelector("[data-cart-total]");
const cartCountElement = document.querySelector("[data-cart-quantity]");

// ===== Initialization & Add to Cart (event delegation) =====
function init() {
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

    const quantityEl = document.querySelector(
      `[data-dropwdown-quantity-${id}]`
    );
    // Ensure quantity element exists(guard clause)
    if (!quantityEl) {
      console.warn(`dropdown quantity element for product ${id} not found`);
      return;
    }
    const dropdownQuantity = quantityEl.value;
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

  // ===== Checkout Modal Handler =====
  document.body.addEventListener("click", (e) => {
    const checkoutBtn = e.target.closest("[data-checkout-button]");

    if (checkoutBtn) {
      openCheckoutModal();
    }

    const nextStepBtn = e.target.closest("[data-next-step]");
    const prevStepBtn = e.target.closest("[data-prev-step]");

    if (nextStepBtn) {
      const step = nextStepBtn.dataset.nextStep;
      navigateCheckoutStep(step);
    }

    if (prevStepBtn) {
      const step = prevStepBtn.dataset.prevStep;
      navigateCheckoutStep(step);
    }
  });

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

// Update your updateCart function
function updateCart() {
  renderCartQuantity(cartCountElement);

  if (!cartItemsContainer || !cartTotalElement) {
    console.warn("Cart container elements not found for renderCart");
    return;
  }

  const cartDetails = getCartDetails();
  renderCart(cartItemsContainer, cartTotalElement, cartDetails);
}

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

function navigateCheckoutStep(step) {
  const contentArea = document.querySelector("[data-checkout-content]");
  if (!contentArea) return;

  switch (step) {
    case "shipping":
      contentArea.innerHTML = renderShippingStep();
      break;
    case "payment":
      contentArea.innerHTML = renderPaymentStep();
      break;
    case "review":
      contentArea.innerHTML = renderReviewStep();
      break;
  }

  // update step indicator
  updateStepIndicator(step);
}

function updateStepIndicator(activeStep) {
  const steps = {
    shipping: 1,
    payment: 2,
    review: 3,
  };

  // get all step numbers
  const stepNumbersEl = document.querySelectorAll("[data-step-number]");

  stepNumbersEl.forEach((el) => {
    const stepNum = parseInt(el.dataset.stepNumber);

    if (stepNum < steps[activeStep]) {
      // Previous step - completed
      el.className =
        "w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center";
    } else if (stepNum === steps[activeStep]) {
      // Current step - active
      el.className =
        "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center";
    } else {
      // Future step - inactive
      el.className =
        "w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center";
    }
  });
}

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
