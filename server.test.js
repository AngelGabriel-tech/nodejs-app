const request = require("supertest");
const app = require("./server");

let server;

beforeAll(() => {
  // Start the server before running tests
  server = app.listen(3000);
});

afterAll(() => {
  // Close the server after tests are done
  server.close();
});

describe("GET /", () => {
  it("should return 'Hello, Jenkins!'", async () => {
    const res = await request(app).get("/");
    expect(res.text).toBe("Hello, Jenkins!");
    expect(res.statusCode).toBe(200);
  });
});
