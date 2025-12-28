import { jest } from "@jest/globals";

describe("saveCartToLocalStorage", () => {
  it("should save cart to local storage", async () => {
    const mockSetItem = jest.fn();

    const mockStorage = { setItem: mockSetItem, getItem: () => null };

    const { addToCart, saveCartToLocalStorage } = await import(
      "../../scripts/cart.js"
    );

    addToCart(1, 2);
    // Inject mock storage when calling the function in the test
    saveCartToLocalStorage(mockStorage);

    expect(mockSetItem).toHaveBeenCalledWith(
      "jumlazon_cart_v1",
      JSON.stringify([{ productId: 1, quantity: 2 }])
    );
  });
});
