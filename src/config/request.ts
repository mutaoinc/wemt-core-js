export default {
  request: {
    baseURL: "https://d2lra2xr.s13.mutaoinc.net",
    header: {
      "Content-Type": "application/json",
      "X-Token": "",
      "X-Sign": "",
      "X-Time": Date.now(),
    },
    params: {},
    data: {},
    timeout: 10000,
  },
  response: {
    code: "code",
    data: "data",
    message: "message",
    timestamp: "timestamp",
  },
};
