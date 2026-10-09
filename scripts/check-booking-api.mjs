import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Интеграционная проверка использует подключённую Supabase-базу.
// Создаёт только помеченные тестовые заявки и удаляет их в finally.
const baseUrl = process.env.BOOKING_TEST_BASE_URL ?? "http://localhost:3000";
const requestIds = [randomUUID(), randomUUID()];
const temporaryDirectory = mkdtempSync(join(tmpdir(), "booking-api-"));
const request = async (path, options) => {
  const response = await fetch(baseUrl + path, options);
  return { status: response.status, body: await response.json() };
};
const post = (input) =>
  request("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
try {
  const calendar = await request("/api/booking/calendar");
  assert.equal(calendar.status, 200);
  assert.equal(calendar.body.data.timeZone, "Asia/Almaty");
  const services = await request("/api/services");
  const service = services.body.data.find(
    (item) => item.isActive && item.durationMinutes === 120,
  );
  assert.ok(service, "A two-hour active service is required");
  const date = new Date(calendar.body.data.today + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + 84);
  const selectedDate = date.toISOString().slice(0, 10);
  const query = new URLSearchParams({
    serviceId: service.id,
    date: selectedDate,
  });
  const initial = await request("/api/booking/availability?" + query);
  assert.equal(initial.status, 200);
  const first = initial.body.data.slots.find(
    (slot) =>
      slot.isAvailable &&
      initial.body.data.slots.some(
        (other) =>
          other.isAvailable &&
          other.startTime > slot.startTime &&
          other.startTime < slot.endTime,
      ),
  );
  assert.ok(
    first,
    "Two overlapping free intervals are required for the concurrency check",
  );
  const second = initial.body.data.slots.find(
    (slot) =>
      slot.isAvailable &&
      slot.startTime > first.startTime &&
      slot.startTime < first.endTime,
  );
  assert.ok(second);
  const payload = {
    serviceId: service.id,
    date: selectedDate,
    startTime: first.startTime,
    clientName: "Тест API",
    clientPhone: "+77000000000",
    requestId: requestIds[0],
  };
  assert.equal(
    (await post({ ...payload, endTime: "20:00", status: "confirmed" })).status,
    400,
  );
  assert.equal((await post({ ...payload, clientPhone: "123" })).status, 400);
  assert.equal(
    (
      await request(
        "/api/booking/availability?" + query + "&date=" + selectedDate,
      )
    ).status,
    400,
  );
  assert.equal(
    (await request("/api/booking/calendar?unknown=true")).status,
    400,
  );
  assert.equal(
    (
      await request(
        "/api/booking/availability?" +
          new URLSearchParams({ serviceId: randomUUID(), date: selectedDate }),
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await request("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://invalid.example",
        },
        body: JSON.stringify(payload),
      })
    ).status,
    403,
  );
  const invalidJson = await request("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(invalidJson.status, 400);
  const concurrent = await Promise.all([
    post(payload),
    post({ ...payload, startTime: second.startTime, requestId: requestIds[1] }),
  ]);
  assert.deepEqual(
    concurrent.map((result) => result.status).sort(),
    [201, 409],
  );
  const winningIndex = concurrent.findIndex((result) => result.status === 201);
  const winner = concurrent[winningIndex];
  assert.equal(winner.body.data.status, "pending");
  assert.equal(winner.body.data.durationMinutes, 120);
  assert.ok(
    !("clientPhone" in winner.body.data) && !("clientName" in winner.body.data),
  );
  const repeated = await post({
    ...payload,
    startTime: winningIndex === 0 ? first.startTime : second.startTime,
    requestId: requestIds[winningIndex],
  });
  assert.equal(repeated.status, 201);
  assert.equal(repeated.body.data.id, winner.body.data.id);
  const refreshed = await request("/api/booking/availability?" + query);
  assert.ok(
    refreshed.body.data.slots
      .filter(
        (slot) =>
          slot.startTime >= winner.body.data.startTime &&
          slot.startTime < winner.body.data.endTime,
      )
      .every((slot) => !slot.isAvailable),
  );
  const privateResponse = await fetch(baseUrl + "/api/bookings");
  assert.equal(privateResponse.status, 405);
  console.log(
    "Booking API: validation, concurrency 201/409, idempotency, pending occupancy and public privacy passed.",
  );
} finally {
  const cleanupFile = join(temporaryDirectory, "cleanup.sql");
  const ids = requestIds.map((id) => "'" + id + "'::uuid").join(", ");
  writeFileSync(
    cleanupFile,
    "delete from public.bookings where request_id in (" +
      ids +
      ") and client_name = 'Тест API';",
  );
  execFileSync(
    "pnpm",
    ["supabase", "db", "query", "--linked", "--file", cleanupFile],
    { stdio: "pipe" },
  );
  rmSync(temporaryDirectory, { recursive: true, force: true });
  console.log("Booking API fixtures removed.");
}
