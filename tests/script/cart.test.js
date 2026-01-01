import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { addToCart, saveCartToLocalStorage } from "../../scripts/cart.js";
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

  test("adds existing products to cart", () => {
    addToCart(2, 5);
    addToCart(2, 3);

    expect(cart).toEqual([{ productId: 2, quantity: 8 }]);
  });
});
