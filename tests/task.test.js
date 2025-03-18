const request = require("supertest");
const app = require("../index");

describe("Task API", () => {
  it("should create a task", async () => {
    const res = await request(app).post("/tasks").send({ title: "Test", priority: "high" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual("Test");
  });
});
