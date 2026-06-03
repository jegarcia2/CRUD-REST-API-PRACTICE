// ---------------------------------------------------------------------------
// Tests use node:test (built in) + supertest. SCHEME: build a FRESH in-memory
// app in beforeEach so every test is isolated — no shared state, no order
// dependence. This is why the app/db factory pattern matters.
// ---------------------------------------------------------------------------
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createDb } from "../src/db.js";

let app;
beforeEach(() => {
    app = createApp(createDb(":memory:")); // throwaway DB per test
});

// helper to create an expense quickly
async function makeExpense(overrides = {}) {
    const body = { amount: 50, category: "meals", description: "lunch", ...overrides };
    return request(app).post("/expenses").send(body);
}

test("POST creates a pending expense -> 201", async () => {
    const res = await makeExpense();
    assert.equal(res.status, 201);
    assert.equal(res.body.status, "pending");
    assert.ok(res.body.id);
});

test("POST rejects non-positive amount -> 400", async () => {
    const res = await makeExpense({ amount: 0 });
    assert.equal(res.status, 400);
});

test("POST rejects bad category -> 400", async () => {
    const res = await makeExpense({ category: "snacks" });
    assert.equal(res.status, 400);
});

test("POST rejects whitespace-only description -> 400", async () => {
    const res = await makeExpense({ description: "   " });
    assert.equal(res.status, 400);
});

test("GET /:id returns 404 when missing", async () => {
    const res = await request(app).get("/expenses/999");
    assert.equal(res.status, 404);
});

test("GET list filters by status", async () => {
    await makeExpense();
    const created = await makeExpense();
    await request(app).post(`/expenses/${created.body.id}/status`).send({ status: "approved" });
    const res = await request(app).get("/expenses?status=approved");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
});

test("GET list rejects unknown status filter -> 400 (trap #1)", async () => {
    const res = await request(app).get("/expenses?status=banana");
    assert.equal(res.status, 400);
});

test("approved expense cannot be edited -> 409 (trap #2)", async () => {
    const created = await makeExpense();
    await request(app).post(`/expenses/${created.body.id}/status`).send({ status: "approved" });
    const res = await request(app).patch(`/expenses/${created.body.id}`).send({ amount: 99 });
    assert.equal(res.status, 409);
});

test("cannot re-decide a settled expense -> 409", async () => {
    const created = await makeExpense();
    await request(app).post(`/expenses/${created.body.id}/status`).send({ status: "approved" });
    const res = await request(app).post(`/expenses/${created.body.id}/status`).send({ status: "rejected" });
    assert.equal(res.status, 409);
});

test("DELETE removes -> 204, then 404", async () => {
    const created = await makeExpense();
    const del = await request(app).delete(`/expenses/${created.body.id}`);
    assert.equal(del.status, 204);
    const again = await request(app).delete(`/expenses/${created.body.id}`);
    assert.equal(again.status, 404);
});

test("malformed JSON -> 400", async () => {
    const res = await request(app)
        .post("/expenses")
        .set("Content-Type", "application/json")
        .send("{ bad json ");
    assert.equal(res.status, 400);
});