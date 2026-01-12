import { loadProducts } from "../data/products.js";

// ===== Render products =====
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
              aria-label="Add ${product.name} to cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
  `
    )
    .join("");
}

export async function initProducts(productsContainer, onAddToCart) {
  if (!productsContainer) return;

  try {
    await loadProducts();
    renderProducts(productsContainer);
  } catch {
    productsContainer.innerHTML =
      "<p class='text-red-500'>Failed to load products.</p>";
  }

  // Store all timeouts here (outside the event listener)
  const addedMessageTimeouts = {};

  // SINGLE event listener for ALL add-to-cart buttons (current and future)
  productsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const id = Number(btn.dataset.productId);
    const quantityEl = document.querySelector(
      `[data-dropwdown-quantity-${id}]`
    );
    // Ensure quantity element exists(guard clause)
    if (!quantityEl) {
      console.warn(`dropdown quantity element for product ${id} not found`);
      return;
    }
    const qty = quantityEl.value;

    // 🔑 notify app
    onAddToCart(id, qty);

    // Show "Added" message
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
