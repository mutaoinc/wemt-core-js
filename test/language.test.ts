import wemt from "../src/index";

describe("Language Tests", () => {
  test("should translate welcome message with parameters", () => {
    const welcomeMessage = wemt.language.translate("welcome", { name: "John" });
    expect(welcomeMessage).toBeDefined();
    expect(typeof welcomeMessage).toBe("string");
    expect(welcomeMessage).toContain("John");
  });

  test("should translate simple messages", () => {
    const helloMessage = wemt.language.translate("hello");
    expect(helloMessage).toBeDefined();
    expect(typeof helloMessage).toBe("string");
  });

  test("should handle missing translation keys", () => {
    const missingKey = "non.existent.key";
    const result = wemt.language.translate(missingKey);
    expect(result).toBe(missingKey);
  });

  test("should handle translation with parameters", () => {
    const message = wemt.language.translate("welcome", { name: "Alice" });
    expect(message).toBeDefined();
    expect(typeof message).toBe("string");
    expect(message).toContain("Alice");
  });
});
