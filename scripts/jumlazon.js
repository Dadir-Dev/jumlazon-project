// ===== Products Data =====
const products = [
  {
    id: 1,
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    price: 10.9,
    originalPrice: 12.99,
    rating: {
      stars: 4.5,
      count: 87,
    },
    image:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Clothing",
  },
  {
    id: 2,
    name: "Intermediate Size Basketball",
    price: 20.95,
    originalPrice: null,
    rating: {
      stars: 4,
      count: 127,
    },
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Sports",
  },
  {
    id: 3,
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    price: 7.99,
    originalPrice: 9.99,
    rating: {
      stars: 5,
      count: 56,
    },
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Clothing",
  },
  {
    id: 4,
    name: "Wireless Bluetooth Headphones with Noise Cancellation",
    price: 89.99,
    originalPrice: 129.99,
    rating: {
      stars: 3.5,
      count: 243,
    },
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
  },
];

// ===== DOM Elements =====
const domElements = {
  productsContainer: document.querySelector("[data-products-container]"),
};

// ===== Render Products =====
function renderProducts() {
  domElements.productsContainer.innerHTML = products
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
              <span class="text-lg font-bold">$${product.price}</span>
              ${
                product.originalPrice
                  ? `<span class="text-sm text-gray-500 line-through ml-2"
                >$${product.originalPrice}</span
              >`
                  : ""
              }
            </div>

            <button
              class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
  `
    )
    .join("");
}

renderProducts();
// Mobile search toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector(".js-search-toggle");
  const mobileSearch = document.getElementById("mobileSearch");

  searchButton.addEventListener("click", function () {
    mobileSearch.classList.toggle("hidden");
  });
});
