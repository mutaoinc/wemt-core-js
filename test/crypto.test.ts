import wemt from "../src/index";

// 注册加密相关的钩子
wemt.hook.register("crypto.encrypt.before", (data: any) => {
  console.log("加密前的数据:", data);
  return data;
});

describe("Crypto Tests", () => {
  beforeEach(() => {
    wemt.hook.clear();
  });

  test("encryption and decryption should work correctly", async () => {
    const testData = {
      username: "test",
      password: "123456",
    };

    // 测试加密
    const encrypted = await wemt.crypto.encrypt(testData);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe("string");

    // 测试解密
    const decrypted = await wemt.crypto.decrypt(encrypted);
    expect(decrypted).toEqual(testData);
  });

  test("hash functions should generate correct hashes", async () => {
    const password = "password";

    // 测试MD5
    const md5Hash = await wemt.crypto.hash(password, "MD5");
    expect(md5Hash).toBeDefined();
    expect(md5Hash.length).toBe(32);

    // 测试SHA256
    const sha256Hash = await wemt.crypto.hash(password, "SHA256");
    expect(sha256Hash).toBeDefined();
    expect(sha256Hash.length).toBe(64);
  });

  test("crypto hooks should be called", async () => {
    const mockHook = jest.fn((data: any) => data);
    wemt.hook.register("crypto.encrypt.before", mockHook);

    const testData = { test: "data" };
    await wemt.crypto.encrypt(testData);

    expect(mockHook).toHaveBeenCalledWith(testData);
  });
});
