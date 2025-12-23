import { getCartDetails, getCartTotalPrice } from "./cart.js";
// import dayjs from "../node_modules/dayjs";

// ===== STATE — all checkout data is stored here ====
const CHECKOUT_STORAGE_KEY = "jumlazon_checkout_v1";
let checkoutData = {
  shipping: {},
  delivery: { option: "standard", cost: 5.99, minDays: 5, maxDays: 7 },
  payment: { method: "card" },
};
const DELIVERY_OPTIONS = {
  standard: { cost: 5.99, minDays: 5, maxDays: 7 },
  express: { cost: 12.99, minDays: 2, maxDays: 3 },
};

function saveCheckoutToLocalStorage() {
  localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutData));
  console.log("checkoutData", checkoutData);
}

function loadCheckoutFromLocalStorage() {
  const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);
  if (!stored) return;

  try {
    const parsedCheckout = JSON.parse(stored);
    checkoutData = { ...checkoutData, ...parsedCheckout };
  } catch (e) {
    console.warn("Failed to load checkout data", e);
  }
}

// ===== Step 1: Shipping Form =====
function renderShippingStep() {
  const shippingData = checkoutData.shipping;

  // We use values from checkoutData to pre-fill the inputs if they exist

  return `
    <div class="space-y-6">

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
    
      <!-- Delivery Option -->
      <div class="mt-6 pt-4">
        <h4 class="font-bold mb-3">Delivery Option</h4>
        
        <label class="flex items-center justify-between p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-300">
          <div class="flex items-center">
            <input type="radio" name="delivery-option" value="standard" class="mr-3" 
              ${checkoutData.delivery.option === "standard" ? "checked" : ""}>
            <div>
              <div class="font-medium">Standard Delivery</div>
              <div  class="text-sm text-gray-500">Estimated ${
                DELIVERY_OPTIONS.standard.minDays
              }–${DELIVERY_OPTIONS.standard.maxDays} business days</div>
            </div>
          </div>
          <div class="font-bold text-blue-600">$5.99</div>
        </label>

        <label class="flex items-center justify-between p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-300">
          <div class="flex items-center">
            <input type="radio" name="delivery-option" value="express" class="mr-3"
              ${checkoutData.delivery.option === "express" ? "checked" : ""}>
            <div>
              <div class="font-medium">Express Delivery</div>
              <div class="text-sm text-gray-500">Estimated ${
                DELIVERY_OPTIONS.express.minDays
              }–${DELIVERY_OPTIONS.express.maxDays} business days</div>
            </div>
          </div>
          <div class="font-bold">$12.99</div>
        </label>
      </div>

      <!-- Order Summary -->
      <div data-order-summary></div>
      
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
  // read data from checkoutData
  const shippingData = checkoutData.shipping;
  const paymentData = checkoutData.payment;
  const cartDetails = getCartDetails();
  const totalPrice = getCartTotalPrice();

  return `
    <div class="space-y-6">
      <h3 class="font-bold">Review Your Order</h3>
      
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
      
      <!-- Shipping Information -->
      <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-3">Shipping Information</h3>
          <div class="text-sm">
            <div>${shippingData.firstName} ${shippingData.lastName}</div>
            <div>${shippingData.address}</div>
            <div>${shippingData.city}, ${shippingData.zip}</div>
            <div>${shippingData.email}</div>
          </div>
        </div>
      
      <!-- Payment Method -->
      <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-3">Payment Method</h3>
          <div class="text-sm">
            <div>${
              paymentData.method === "card" ? "Credit/Debit Card" : "PayPal"
            }</div>
          </div>
        </div>
      
      <!-- Navigation -->
      <div class="flex justify-between pt-6">
        <button 
          class="px-6 py-3 border rounded-lg hover:bg-gray-50 transition duration-300"
          data-prev-step="payment"
        >
          ← Back
        </button>
        <button 
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          data-next-step="review"
        >
          Place Order
        </button>
      </div>
    </div>
  `;
}

// ===== Save Data before moving forward =====
export function saveAndProceed(event, currentStep, nextStep, formElement) {
  // Prevent default
  event.preventDefault();

  if (!validateStep(formElement)) {
    alert("Please fill out all required fields");
    return;
  }

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
  saveCheckoutToLocalStorage();

  // Disable buttons to prevent multiple clicks
  const buttons = form.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = true;
  });

  // Navigate to next step
  navigateCheckoutStep(nextStep);

  // Re-enable buttons after a short delay
  setTimeout(() => {
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }, 500);
}

// ===== INITIALIZATION + NAVIGATION =====
export function initCheckout() {
  const contentArea = document.querySelector("[data-checkout-content]");
  if (!contentArea) return;

  loadCheckoutFromLocalStorage();

  // Start with shipping step
  contentArea.innerHTML = renderShippingStep();
  updateOrderSummary();
  updateStepIndicator("shipping");
  // Attach live validation for the initially rendered shipping form
  attachLiveValidation(
    contentArea.querySelector("[data-checkout-form='shipping']")
  );
}

export function navigateCheckoutStep(step) {
  const contentArea = document.querySelector("[data-checkout-content]");

  if (!contentArea) return;

  switch (step) {
    case "shipping":
      contentArea.innerHTML = renderShippingStep();
      updateOrderSummary();
      attachLiveValidation(
        contentArea.querySelector("[data-checkout-form='shipping']")
      );
      break;
    case "payment":
      contentArea.innerHTML = renderPaymentStep();
      attachLiveValidation(
        contentArea.querySelector("[data-checkout-form='payment']")
      );
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

// ===== FORM VALIDATION =====
// Pure, testable
export function isFormValid(form) {
  return !!form && form.checkValidity();
}

// UI concern
export function validateStep(form) {
  if (!isFormValid(form)) {
    form?.reportValidity?.();
    return false;
  }
  return true;
}

// Validation Styles
const INVALID_CLASS = "border-red-500 focus:ring-red-500";
const VALID_CLASS = "border-green-500 focus:ring-green-500";

function attachLiveValidation(formElement) {
  if (!formElement) return;

  const inputs = formElement.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.checkValidity()) {
        input.classList.remove(...INVALID_CLASS.split(" "));
        input.classList.add(...VALID_CLASS.split(" "));
      } else {
        input.classList.remove(...VALID_CLASS.split(" "));
        input.classList.add(...INVALID_CLASS.split(" "));
      }
    });

    input.addEventListener("blur", () => {
      if (!input.checkValidity()) {
        input.reportValidity();
      }
    });
  });
}

export function setDeliveryOption(option) {
  if (!DELIVERY_OPTIONS.hasOwnProperty(option)) {
    console.warn(`Invalid delivery option: ${option}`);
    return;
  }

  const today = dayjs();

  if (today) {
    const deliveryStartDate = today
      .add(DELIVERY_OPTIONS[option].minDays, "day")
      .format("MMM D");

    const deliveryEndDate = today
      .add(DELIVERY_OPTIONS[option].maxDays, "day")
      .format("MMM D");

    checkoutData.delivery = {
      option,
      cost: DELIVERY_OPTIONS[option].cost,
      minDays: DELIVERY_OPTIONS[option].minDays,
      maxDays: DELIVERY_OPTIONS[option].maxDays,
      deliveryStartDate,
      deliveryEndDate,
    };
  }

  saveCheckoutToLocalStorage();
}

function getDeliveryCost() {
  return checkoutData.delivery.cost;
}

function getOrderTotal() {
  return getCartTotalPrice() + getDeliveryCost();
}

function getOrderSummaryHTML() {
  const cartDetails = getCartDetails();
  const totalPrice = getOrderTotal();
  const delivery = checkoutData.delivery;
  return `
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
          <div class="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span>$${getDeliveryCost().toFixed(2)}</span>
          </div>
          ${
            delivery.deliveryStartDate
              ? `
            <div class="flex justify-between text-sm mt-1">
              Arrives between 
              <span class="font-medium text-blue-600">
                ${delivery.deliveryStartDate} – ${delivery.deliveryEndDate}
              </span>
            </div>
          `
              : ""
          }

        <div class="border-t pt-3 mt-3">
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span>$${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
  `;
}

export function updateOrderSummary() {
  const container = document.querySelector("[data-order-summary]");
  if (!container) return;

  container.innerHTML = getOrderSummaryHTML();
}
