import { jest } from "@jest/globals";
import { connectTestDB, closeTestDB } from "./setup.js";

jest.setTimeout(20000);

await jest.unstable_mockModule("../src/config/redis.js", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
    connect: jest.fn(),
  },
}));

// IMPORTANT: dynamic imports AFTER mocking
const { default: app } = await import("../src/app.js");
const { redisClient } = await import("../src/config/redis.js");
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";

const mockedRedis = redisClient as unknown as {
  get: jest.Mock;
  set: jest.Mock;
  del: jest.Mock;
  keys: jest.Mock;
};

beforeAll(connectTestDB);
afterAll(closeTestDB);

import request from "supertest";

describe("Task", () => {
    let token: string;

    beforeAll(async () => {
        const res = await request(app).post("/api/auth/signup").send({
            name: "TaskUser",
            email: "task@example.com",
            password: "123456",
        });
        token = res.body.token;
    });

    it("should create a task", async () => {
        const res = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Task" });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Test Task");
    });

    it("should get tasks", async () => {
        const res = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should reject unauthorized request", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res.status).toBe(401);
    });

    it("should support pagination", async () => {
        const res = await request(app)
            .get("/api/tasks?page=1&limit=5")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.pagination).toBeDefined();
    });

    it("should update task", async () => {
        const create = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Old Title" });

        const update = await request(app)
            .put(`/api/tasks/${create.body._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "New Title" });

        expect(update.status).toBe(200);
        expect(update.body.title).toBe("New Title");
    });

    it("should delete task", async () => {
        const create = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "To Delete" });

        const del = await request(app)
            .delete(`/api/tasks/${create.body._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(del.status).toBe(204);
    });

    it("should return 404 for invalid task id", async () => {
        const res = await request(app)
            .put("/api/tasks/64f000000000000000000000")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test" });

        expect(res.status).toBe(404);
    });

    it("should reject invalid token", async () => {
        const res = await request(app)
            .get("/api/tasks")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.status).toBe(401);
    });



    it("should return cached tasks if available", async () => {
        mockedRedis.get.mockResolvedValue(
            JSON.stringify({ data: [], pagination: {} })
        );

        const res = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });


});
