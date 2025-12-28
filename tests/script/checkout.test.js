describe("Checkout form validation", () => {
  test("returns false when form is invalid", async () => {
    const { isFormValid } = await import("../../scripts/checkout.js");
    const fakeForm = {
      checkValidity: () => false,
    };

    expect(isFormValid(fakeForm)).toBe(false);
  });

  test("returns true when form is valid", async () => {
    const { isFormValid } = await import("../../scripts/checkout.js");
    const fakeForm = {
      checkValidity: () => true,
    };

    expect(isFormValid(fakeForm)).toBe(true);
  });
});
