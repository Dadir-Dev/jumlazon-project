import { beforeEach, describe, expect, jest } from "@jest/globals";
import {
  saveCartToLocalStorage,
  addToCartPure,
  removeFromCartPure,
  updateQuantityPure,
  getCartQuantityPure,
  getCartTotalPricePure,
} from "../../scripts/cart.js";
import { cart } from "../../data/cartData.js";
import * as cartModule from "../../scripts/cart.js";

describe("saveCartToLocalStorage", () => {
  it("should save cart to local storage", async () => {
    const mockSetItem = jest.fn();

    const mockStorage = { setItem: mockSetItem, getItem: () => null };

    cartModule.addToCart(1, 2);
    // Inject mock storage when calling the function in the test
    saveCartToLocalStorage(mockStorage);

    expect(mockSetItem).toHaveBeenCalledWith(
      "jumlazon_cart_v1",
      JSON.stringify([{ productId: 1, quantity: 2 }])
    );
  });
});

describe("addToCartPure", () => {
  test("adds new item to empty cart", () => {
    const cart = [];
    const updatedCart = addToCartPure(cart, 1, 3);
    expect(updatedCart).toEqual([{ productId: 1, quantity: 3 }]);
  });

  test("increments quantity if item exists", () => {
    const cart = [{ productId: 3, quantity: 3 }];
    const updatedCart = addToCartPure(cart, 3, 7);

    expect(updatedCart).toEqual([{ productId: 3, quantity: 10 }]);
    expect(cart).toEqual([{ productId: 3, quantity: 3 }]); //  immutable
  });
});

describe("removeFromCartPure", () => {
  test("removes an item by productId", () => {
    const cart = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ];
    const updatedCart = removeFromCartPure(cart, 1);

    expect(updatedCart).toEqual([{ productId: 2, quantity: 1 }]);
    expect(cart.length).toBe(2); // immutability check
  });

  test("returns same cart if product does not exist", () => {
    const cart = [{ productIda: 3, quantity: 4 }];
    const result = removeFromCartPure(cart, 5);

    expect(result).toEqual([{ productIda: 3, quantity: 4 }]);
  });
});

describe("updateQuantityPure", () => {
  test("increments item quantity", () => {
    const cart = [{ productId: 2, quantity: 2 }];
    const updatedCart = updateQuantityPure(cart, 2, 1);

    // original cart remains unchanged
    expect(cart[0].quantity).toBe(2);
    // incremented new cart
    expect(updatedCart[0].quantity).toBe(3);
  });

  test("descrements item quantity", () => {
    const cart = [{ productId: 1, quantity: 5 }];
    const descrementedCart = updateQuantityPure(cart, 1, -1);

    // original cart remains unchanged
    expect(cart[0].quantity).toBe(5);

    // decremented new cart
    expect(descrementedCart[0].quantity).toBe(4);
  });

  test("does not decrement quantity below 1", () => {
    const cart = [{ productId: 4, quantity: 1 }];
    const updatedCart = updateQuantityPure(cart, 4, -1);
    expect(updatedCart[0].quantity).toBe(1);
  });

  test("returns same cart if productId not found", () => {
    const cart = [{ productId: 6, quantity: 2 }];
    const updatedCart = updateQuantityPure(cart, 10, 1);
    expect(updatedCart).toEqual(cart);
  });
});

describe("getCartQuantityPure", () => {
  test("returns total quantity in cart", () => {
    const cart = [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 4 },
      { productId: 5, quantity: 6 },
    ];

    const totalQuantity = getCartQuantityPure(cart);

    expect(totalQuantity).toBe(12);
  });

  test("edge case: returns 0 for an empty cart", () => {
    const cart = [];
    const totalQuantity = getCartQuantityPure(cart);

    expect(totalQuantity).toBe(0);
  });

  test("does not mutate the cart", () => {
    const cart = [{ productId: 1, quantity: 2 }];

    getCartQuantityPure(cart);

    expect(cart).toEqual([{ productId: 1, quantity: 2 }]);
  });
});

describe("getCartTotalPricePure", () => {
  const products = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mouse", price: 50 },
    { id: 3, name: "Keyboard", price: 150 },
  ];

  test("returns 0 for an empty cart", () => {
    const cart = [];
    const totalPrice = getCartTotalPricePure(cart, products);

    expect(totalPrice).toBe(0);
  });

  test("calculates total price correctly", () => {
    const cart = [
      { productId: 1, quantity: 1 }, // 1000
      { productId: 2, quantity: 1 }, // 50
    ];

    const totalPrice = getCartTotalPricePure(cart, products);

    expect(totalPrice).toBe(1050);
  });

  test("handles multiple quantities correctly", () => {
    const cart = [
      { productId: 1, quantity: 2 }, // 1000 * 2 = 2000
      { productId: 3, quantity: 3 }, // 150 * 3 = 450
    ];

    const totalPrice = getCartTotalPricePure(cart, products);
    expect(totalPrice).toBe(2450);
  });

  test("edge case: ignores cart items with missing products", () => {
    const cart = [
      { productId: 1, quantity: 2 }, // 1000 * 2 = 2000
      { productId: 99, quantity: 3 }, // product not found
    ];

    const totalPrice = getCartTotalPricePure(cart, products);

    expect(totalPrice).toBe(2000);
  });

  test("edge case: does not mutate cart or products", () => {
    const cart = [{ productId: 3, quantity: 4 }];

    getCartTotalPricePure(cart, products);

    expect(cart).toEqual([{ productId: 3, quantity: 4 }]);
    expect(products).toEqual([
      { id: 1, name: "Laptop", price: 1000 },
      { id: 2, name: "Mouse", price: 50 },
      { id: 3, name: "Keyboard", price: 150 },
    ]);
  });
});

describe("addToCart", () => {
  beforeEach(() => {
    cart.length = 0;
    jest.restoreAllMocks();
  });
  test("adds a new product to cart", () => {
    cartModule.addToCart(1, 3);
    expect(cart).toEqual([{ productId: 1, quantity: 3 }]);
  });

  test("increases quantity if product already exists", () => {
    cartModule.addToCart(2, 5);
    cartModule.addToCart(2, 3);

    expect(cart).toEqual([{ productId: 2, quantity: 8 }]);
  });

  test("adds two different products", () => {
    cartModule.addToCart(3, 3);
    cartModule.addToCart(4, 4);

    expect(cart).toEqual([
      { productId: 3, quantity: 3 },
      { productId: 4, quantity: 4 },
    ]);
  });
});

describe("addToCart side effects", () => {
  beforeEach(() => {
    cart.length = 0;
    jest.resetAllMocks();
  });

  test("calls saveCartToLocalStorage once", () => {
    const spy = jest.spyOn(cartModule.cartAPI, "saveCartToLocalStorage");

    cartModule.addToCart(1, 2);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(cart).toEqual([{ productId: 1, quantity: 2 }]);
  });
});

describe("removeFromCart", () => {
  beforeEach(() => {
    cart.length = 0;
    jest.resetAllMocks();
  });
  test("removes product from cart", () => {
    cart.push({ productId: 1, quantity: 3 }, { productId: 4, quantity: 4 });

    cartModule.removeFromCart(1);
    expect(cart).toEqual([{ productId: 4, quantity: 4 }]);
  });

  test("edge case: returns same cart if product does not exist", () => {
    cart.push({ productId: 3, quantity: 3 });

    cartModule.removeFromCart(99);
    expect(cart).toEqual([{ productId: 3, quantity: 3 }]);
  });

  test("persists cart after removal", () => {
    const spy = jest.spyOn(cartModule.cartAPI, "saveCartToLocalStorage");
    cart.push({ productId: 2, quantity: 5 });

    cartModule.removeFromCart(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(cart).toEqual([]);
  });
});
