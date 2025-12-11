import { getCartDetails, getCartTotalPrice } from "./cart.js";

// ===== STATE — all checkout data is stored here ====
let checkoutData = {
  shipping: {},
  payment: { method: "card" },
};

// ===== Step 1: Shipping Form =====
function renderShippingStep() {
  const cartDetails = getCartDetails();
  const totalPrice = getCartTotalPrice();
  const shippingData = checkoutData.shipping;

  // We use values from checkoutData to pre-fill the inputs if they exist

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
      <form class="space-y-4" data-checkout-form="shipping">
        <h3 class="font-bold">Shipping Information</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text" 
              name="firstName"
              class="w-full border rounded-lg px-3 py-2" 
              data-shipping-firstname
              placeholder="e.g. John"
              required
              minlength="2"
              maxlength="40"
              pattern="^[a-zA-Z ]+$"
              value="${shippingData.firstName || ""}"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              class="w-full border rounded-lg px-3 py-2" 
              data-shipping-lastname
              placeholder="e.g. Doe"
              required
              minlength="2"
              maxlength="40" 
              pattern="^[a-zA-Z ]+$"
              value="${shippingData.lastName || ""}"
            >
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input 
            type="text" 
            name="address"
            class="w-full border rounded-lg px-3 py-2" 
            data-shipping-address
            placeholder="e.g. 123 Main St"
            required
            minlength="5"
            maxlength="80"
            pattern="^[a-zA-Z0-9\s,.'-]*$"
            value="${shippingData.address || ""}"
          >
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input 
              type="text" 
              name="city"
              class="w-full border rounded-lg px-3 py-2" 
              data-shipping-city
              placeholder="e.g. New York"
              required
              minlength="2"
              maxlength="50"
              pattern="^[a-zA-Z ]+$"
              value="${shippingData.city || ""}"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input 
              type="text" 
              name="zip"
              class="w-full border rounded-lg px-3 py-2" 
              data-shipping-zip
              required
              inputmode="numeric"
              minlength="4"
              maxlength="10"
              pattern="\\d{4,10}"
              placeholder="e.g. 10001"
              value="${shippingData.zip || ""}"
            >
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            class="w-full border rounded-lg px-3 py-2" 
            data-shipping-email
            placeholder="e.g. johndoe@gmail.com"
            required
            maxlength="60"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            value="${shippingData.email || ""}"
          >
        </div>
      </form>
      
      <!-- Navigation -->
      <div class="flex justify-end pt-6">
        <button 
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          data-next-step="payment" 
          type="submit"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  `;
}

// ===== Step 2: Payment Form (simplified) =====
function renderPaymentStep() {
  const paymentData = checkoutData.payment;
  return `
    <form data-checkout-form="payment" class="space-y-6">
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
          <input type="text" name="cardNumber" class="w-full border rounded-lg px-3 py-2" placeholder="1234 5678 9012 3456" pattern="\\d{16}" inputmode="numeric" value="${
            paymentData.cardNumber || ""
          }">
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="text" name="expiryDate" class="w-full border rounded-lg px-3 py-2" placeholder="MM/YY" pattern="^(0[1-9]|1[0-2])\/\d{2}$" inputmode="numeric" value="${
              paymentData.expiryDate || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
            <input type="text" name="cvc" class="w-full border rounded-lg px-3 py-2" placeholder="123" pattern="\\d{3}" inputmode="numeric" value="${
              paymentData.cvc || ""
            }">
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
    </form>
  `;
}

// ===== Step 3: Review & Place Order =====
function renderReviewStep() {
  return `<div>Review step - coming soon</div>`;
}

// ===== Save Data before moving forward =====
export function saveAndProceed(event, currentStep, nextStep, formElement) {
  // Prevent default
  event.preventDefault();

  // Determine the form element to gather data from.
  const form = formElement;

  if (!form) {
    console.warn(
      "saveAndProceed: no HTMLFormElement found to collect data from"
    );
    // still navigate to the next step so UX isn't blocked
    navigateCheckoutStep(nextStep);
    return;
  }

  // Gather form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Save data to state
  checkoutData[currentStep] = data;

  // Navigate to next step
  navigateCheckoutStep(nextStep);
}

// ===== INITIALIZATION + NAVIGATION =====
export function initCheckout() {
  const contentArea = document.querySelector("[data-checkout-content]");
  if (!contentArea) return;

  // Start with shipping step
  contentArea.innerHTML = renderShippingStep();
  updateStepIndicator("shipping");
}

export function navigateCheckoutStep(step) {
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

// ===== STEP INDICATOR UI UPDATE =====
export function updateStepIndicator(activeStep) {
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

  // Update labels
  document.querySelectorAll("[data-step-label]").forEach((el) => {
    const stepName = el.dataset.stepLabel;
    if (stepName === activeStep) {
      el.className = "ml-2 font-medium text-blue-600";
    } else if (steps[stepName] < steps[activeStep]) {
      el.className = "ml-2 font-medium text-green-600";
    } else {
      el.className = "ml-2 text-gray-500";
    }
  });
}
