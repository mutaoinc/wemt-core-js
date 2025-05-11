import wemt from "../src/index";

describe("Request Tests", () => {
  beforeEach(() => {
    wemt.hook.clear();
    jest.clearAllMocks();
  });

  test("GET request should work correctly", async () => {
    // 模拟GET请求响应
    const mockResponse = { data: { code: 0, data: { id: 1, name: "test" }, message: "" } };
    jest.spyOn(wemt.request, "get").mockResolvedValue(mockResponse);

    const response = await wemt.request.get("api/user/get");
    expect(response).toEqual(mockResponse);
    expect(wemt.request.get).toHaveBeenCalledWith("api/user/get");
  });

  test("POST request should work correctly", async () => {
    // 模拟POST请求响应
    const mockResponse = { data: { code: 0, data: { success: true }, message: "" } };
    jest.spyOn(wemt.request, "post").mockResolvedValue(mockResponse);

    const postData = {
      username: "testuser",
      email: "test@example.com",
    };

    const response = await wemt.request.post("api/user/create", postData);
    expect(response).toEqual(mockResponse);
    expect(wemt.request.post).toHaveBeenCalledWith("api/user/create", postData);
  });

  test("request hooks should modify request and response", async () => {
    // 注册请求钩子
    wemt.hook.register("request.before", (config: any) => {
      config.headers = { ...config.headers, "X-Test": "test" };
      return config;
    });

    wemt.hook.register("request.response", (response: any) => {
      return { ...response, data: { ...response.data, modified: true } };
    });

    // 模拟请求响应
    const mockResponse = { data: { code: 0, data: { id: 1 }, message: "" } };
    jest.spyOn(wemt.request, "get").mockResolvedValue(mockResponse);

    const response = await wemt.request.get("api/user/get");
    expect(response.data.modified).toBe(true);
  });

  test("should handle request errors", async () => {
    // 模拟请求错误
    const mockError = new Error("Network error");
    jest.spyOn(wemt.request, "get").mockRejectedValue(mockError);

    await expect(wemt.request.get("api/user/get")).rejects.toThrow("Network error");
  });
});
