import { products } from "../data/products.js";

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

  // Use event delegation so buttons added dynamically respond to clicks
  productsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn || !productsContainer.contains(btn)) return;

    const id = Number(btn.dataset.productId);
    const product = products.find((p) => p.id === id);
    if (!product) return;

    console.log(product, "added to cart");
    // TODO: integrate with cart logic (localStorage, UI update, etc.)
  });
}

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
