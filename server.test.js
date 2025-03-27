const request = require("supertest");
const chai = require("chai");
const app = require("./server");

const expect = chai.expect;

let server;

before((done) => {
  // Start the server on a random available port
  server = app.listen(0, () => {
    done();
  });
});

after((done) => {
  // Close the server after tests are done
  server.close(() => {
    done();
  });
});

describe("GET /", () => {
  it("should return 'Hello, Jenkins!'", (done) => {
    request(server)
      .get("/")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal("Hello, Jenkins!");
        expect(res.status).to.equal(200);
        done();
      });
  });
});
