const request = require("supertest");
const app = require("../app");

describe("GET /api/menu", () => {
  test("trả về status 200", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.status).toBe(200);
  });

  test("trả về mảng", async () => {
    const res = await request(app).get("/api/menu");
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/table/:tableNumber", () => {
  test("token sai thì trả về 403", async () => {
    const res = await request(app).get("/api/table/1?token=sai123");
    expect(res.status).toBe(403);
  });

  test("không có token thì trả về 401", async () => {
    const res = await request(app).get("/api/table/1");
    expect(res.status).toBe(401);
  });
});
