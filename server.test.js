const request = require("supertest");
const app = require("./server");

let server;

beforeAll(() => {
  // Start the server on a random available port
  server = app.listen(0);
});

afterAll((done) => {
  // Close the server after tests are done
  server.close(() => {
    done();
  });
});

describe("GET /", () => {
  it("should return 'Hello, Jenkins!'", async () => {
    const res = await request(server).get("/");
    expect(res.text).toBe("Hello, Jenkins!");
    expect(res.statusCode).toBe(200);
  });
});


