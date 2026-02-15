import request from "supertest";
import app from "../src/app.js";
import { connectTestDB, closeTestDB } from "./setup.js";
import { beforeAll, jest, afterAll, describe, it, expect  } from "@jest/globals";

beforeAll(connectTestDB);
afterAll(closeTestDB);

describe("Auth", () => {
  it("should signup a user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should login a user", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Test",
      email: "login@example.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

