import wemt from "../src/index";

describe("Hook Tests", () => {
  beforeEach(() => {
    // 清除所有已注册的钩子
    wemt.hook.clear();
  });

  test("transform hook should convert string to uppercase", async () => {
    // 注册transform钩子
    wemt.hook.register("transform", (value: string) => {
      return value.toUpperCase();
    });

    // 执行钩子并验证结果
    const result = await wemt.hook.exec("transform", "hello");
    expect(result).toBe("HELLO");
  });

  test("request hooks should modify request config and response", async () => {
    // 注册request钩子
    wemt.hook.register("request.before", (config: any) => {
      config.headers = { ...config.headers, "X-Test": "test" };
      return config;
    });

    wemt.hook.register("request.response", (response: any) => {
      return { ...response, data: { ...response.data, modified: true } };
    });

    // 模拟请求
    const mockResponse = { data: { code: 0, data: { id: 1 }, message: "" } };
    jest.spyOn(wemt.request, "get").mockResolvedValue(mockResponse);

    const response = await wemt.request.get("api/user/get");
    expect(response.data.modified).toBe(true);
  });
});
