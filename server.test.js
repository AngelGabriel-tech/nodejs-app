const request = require("supertest");
const app = require("./server").default;

describe("GET /", () => {
  it("should return 'Hello, Jenkins!'", async () => {
    const res = await request(app).get("/");
    expect(res.text).toBe("Hello, Jenkins!");
    expect(res.statusCode).toBe(200);
  });
});
