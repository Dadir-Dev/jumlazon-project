import { getCartDetails, getCartTotalPrice } from "./cart.js";

// Step 1: Shipping Form
export function renderShippingStep() {
  const cartDetails = getCartDetails();
  const totalPrice = getCartTotalPrice();

  return `
    <div class="space-y-6">
      <!-- Order Summary -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="font-bold mb-3">Order Summary</h3>
        ${cartDetails
          .map(
            (item) => `
          <div class="flex justify-between text-sm mb-2">
            <span>${item.product.name} × ${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        `
          )
          .join("")}
        <div class="border-t pt-3 mt-3">
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span>$${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <!-- Shipping Form -->
      <div class="space-y-4">
        <h3 class="font-bold">Shipping Information</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" class="w-full border rounded-lg px-3 py-2" data-shipping-firstname>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" class="w-full border rounded-lg px-3 py-2" data-shipping-lastname>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" class="w-full border rounded-lg px-3 py-2" data-shipping-address>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" class="w-full border rounded-lg px-3 py-2" data-shipping-city>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input type="text" class="w-full border rounded-lg px-3 py-2" data-shipping-zip>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" class="w-full border rounded-lg px-3 py-2" data-shipping-email>
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="flex justify-end pt-6">
        <button 
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          data-next-step="payment"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  `;
}

// Step 2: Payment Form (simplified)
export function renderPaymentStep() {
  return `
    <div class="space-y-6">
      <h3 class="font-bold">Payment Method</h3>
      
      <div class="space-y-4">
        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="payment" value="card" class="mr-3" checked>
          <div>
            <div class="font-medium">Credit/Debit Card</div>
            <div class="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</div>
          </div>
        </label>
        
        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="payment" value="paypal" class="mr-3">
          <div>
            <div class="font-medium">PayPal</div>
            <div class="text-sm text-gray-500">Safer, easier way to pay</div>
          </div>
        </label>
      </div>
      
      <!-- Card Details (shown if card selected) -->
      <div id="cardDetails" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="1234 5678 9012 3456">
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="MM/YY">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
            <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="123">
          </div>
        </div>
      </div>
      
      <div class="flex justify-between pt-6">
        <button 
          class="px-6 py-3 border rounded-lg hover:bg-gray-50 transition duration-300"
          data-prev-step="shipping"
        >
          ← Back
        </button>
        <button 
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          data-next-step="review"
        >
          Review Order
        </button>
      </div>
    </div>
  `;
}

// Step 3: Review & Place Order
export function renderReviewStep() {
  return `<div>Review step - coming soon</div>`;
}

// Initialize checkout
export function initCheckout() {
  const contentArea = document.querySelector("[data-checkout-content]");
  if (!contentArea) return;

  // Start with shipping step
  contentArea.innerHTML = renderShippingStep();
}
