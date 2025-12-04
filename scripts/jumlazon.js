import { products } from "../data/products.js";
import { cart } from "../data/cart.js";

// ===== Render Products =====
function renderProducts(container) {
  container.innerHTML = products
    .map(
      (product) => `
  <div
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
        >
          <div class="p-4">
            <div class="flex justify-center mb-4">
              <img
                src="${product.image}"
                alt="${product.name}"
                class="h-48 object-contain"
              />
            </div>
            <h3 class="font-medium mb-2 line-clamp-2">${product.name}</h3>
            <div class="flex items-center mb-2">
              <img src="Images/ratings/rating-${
                product.rating.stars * 10
              }.png" class="h-5 w-auto" alt="${
        product.rating.stars
      } stars rating"/>
              <span class="text-blue-600 text-sm ml-1">${
                product.rating.count
              }</span>
            </div>
            <div class="mb-4">
              <span class="text-lg font-bold">$${product.price.toFixed(
                2
              )}</span>
              ${
                product.originalPrice
                  ? `<span class="text-sm text-gray-500 line-through ml-2"
                >$${product.originalPrice.toFixed(2)}</span
              >`
                  : ""
              }
            </div>
            <div>
            <select class="w-1/5 bg-gray-100 border border-gray-300 rounded-md shadow-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400" data-dropwdown-quantity-${
              product.id
            }>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            </div>

            <div class="text-center text-green-600 opacity-0" data-added-message-${
              product.id
            }>✅Added</div>
            <button
              class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg transition duration-300" data-add-to-cart data-product-id="${
                product.id
              }"
            >
              Add to Cart
            </button>
          </div>
        </div>
  `
    )
    .join("");
}

// ===== Initialization & Add to Cart (event delegation) =====
function init() {
  const productsContainer = document.querySelector("[data-products-container]");
  if (!productsContainer) {
    console.error("[data-products-container] not found");
    return;
  }

  renderProducts(productsContainer);
  renderCartQuantity();

  const addedMessageTimeouts = {};

  // SINGLE event listener for ALL add-to-cart buttons (current and future)
  productsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn || !productsContainer.contains(btn)) return;

    const id = Number(btn.dataset.productId);
    const product = products.find((p) => p.id === id);
    if (!product) return;
    addToCart(id);
    // show added to cart message
    // The added-message element is a sibling inside the product card, not a child of the button,
    // so query from the button's parent/card container instead of from the button itself.

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
}

function addToCart(productId) {
  // Check if product is already in cart
  const matchingItem = cart.find((item) => item.productId === productId);
  // If it is, increment quantity
  // select the quantity from the dropdown
  const dropdownQuantity = document.querySelector(
    `[data-dropwdown-quantity-${productId}]`
  ).value;
  if (!dropdownQuantity) return;

  const quantity = Number(dropdownQuantity);
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
  updateCart();
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

function updateCart() {
  // This will eventually update multiple things
  renderCartQuantity();
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
