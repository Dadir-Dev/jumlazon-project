import { describe, jest } from "@jest/globals";
import {
  addToCart,
  saveCartToLocalStorage,
  addToCartPure,
  removeFromCartPure,
} from "../../scripts/cart.js";
import { cart } from "../../data/cartData.js";

describe("saveCartToLocalStorage", () => {
  it("should save cart to local storage", async () => {
    const mockSetItem = jest.fn();

    const mockStorage = { setItem: mockSetItem, getItem: () => null };

    addToCart(1, 2);
    // Inject mock storage when calling the function in the test
    saveCartToLocalStorage(mockStorage);

    expect(mockSetItem).toHaveBeenCalledWith(
      "jumlazon_cart_v1",
      JSON.stringify([{ productId: 1, quantity: 2 }])
    );
  });
});

describe("addToCart", () => {
  beforeEach(() => {
    cart.length = 0;
  });
  test("adds a new product to cart", () => {
    addToCart(1, 3);
    expect(cart).toEqual([{ productId: 1, quantity: 3 }]);
  });

  test("increases quantity if product already exists", () => {
    addToCart(2, 5);
    addToCart(2, 3);

    expect(cart).toEqual([{ productId: 2, quantity: 8 }]);
  });

  test("adds two different products", () => {
    addToCart(3, 3);
    addToCart(4, 4);

    expect(cart).toEqual([
      { productId: 3, quantity: 3 },
      { productId: 4, quantity: 4 },
    ]);
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
