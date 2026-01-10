import { cart } from "../../data/cartData.js";
import * as cartModule from "../../scripts/cart.js";
import { beforeEach, describe, expect, jest } from "@jest/globals";

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
    cartModule.updateQuantity(2, 1); // product 4 x4

    // 3. Remove product
    cartModule.removeFromCart(1); //

    // 4. Final state
    expect(cart).toEqual([{ productId: 4, quantity: 4 }]);

    // 5. Persistence side effect
    expect(persistSpy).toHaveBeenCalled();
  });
});
