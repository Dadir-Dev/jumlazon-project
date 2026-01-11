// use Jest's `test` from @jest/globals (avoid accidental picomatch import)
import { cart } from "../../data/cartData.js";
import * as cartModule from "../../scripts/cart.js";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

describe("cart integration flow", () => {
  beforeEach(() => {
    cart.length = 0;
    jest.restoreAllMocks();
  });

  test("add → update → remove → persist", () => {
    const persistSpy = jest.spyOn(cartModule.cartAPI, "saveCartToLocalStorage");

    // 1. Add products
    cartModule.addToCart(1, 2); // product 1 x2
    cartModule.addToCart(4, 5); // product 4 x5

    // 2. Update quantities
    cartModule.updateQuantity(4, -1); // product 4 x4
    cartModule.updateQuantity(1, 1); // product 4 x4

    // 3. Remove product
    cartModule.removeFromCart(1); //

    // 4. Final state
    expect(cart).toEqual([{ productId: 4, quantity: 4 }]);

    // 5. Persistence side effect
    expect(persistSpy).toHaveBeenCalled();
  });

  test("edge case: removing the only item leaves cart empty", () => {
    cartModule.addToCart(1, 5);
    cartModule.removeFromCart(1);

    expect(cart).toEqual([]);
  });

  test("does not modify cart when updating unknown productId", () => {
    cartModule.addToCart(2, 3);
    cartModule.updateQuantity(99, 1);

    expect(cart).toEqual([{ productId: 2, quantity: 3 }]);
  });
});
