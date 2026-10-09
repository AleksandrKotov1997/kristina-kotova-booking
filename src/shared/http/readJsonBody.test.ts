import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { readJsonBody } from "./readJsonBody";

const request = (body: string, headers: Record<string, string> = {}) =>
  new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      Origin: "http://localhost:3000",
      "Content-Type": "application/json",
      ...headers,
    },
    body,
  });

describe("auth request boundary", () => {
  it("reads same-origin JSON with a charset", async () => {
    await expect(
      readJsonBody(
        request('{"email":"owner@example.com"}', {
          "Content-Type": "application/json; charset=utf-8",
        }),
      ),
    ).resolves.toEqual({ email: "owner@example.com" });
  });
  it.each(["", "https://another.example.com", "http://localhost:3001"])(
    "rejects missing or different origins: %s",
    async (origin) => {
      await expect(
        readJsonBody(request("{}", { Origin: origin })),
      ).rejects.toMatchObject({ status: 403 });
    },
  );
  it("rejects non-JSON content", async () => {
    await expect(
      readJsonBody(request("{}", { "Content-Type": "text/plain" })),
    ).rejects.toMatchObject({ status: 415 });
  });
  it("rejects malformed JSON", async () => {
    await expect(readJsonBody(request("{"))).rejects.toMatchObject({
      status: 400,
    });
  });
  it("limits bytes rather than characters", async () => {
    await expect(
      readJsonBody(request(JSON.stringify({ password: "я".repeat(2100) }))),
    ).rejects.toMatchObject({ status: 413 });
  });
});

it("uses the public Host header when Docker maps another port", async () => {
  const input = new NextRequest("http://0.0.0.0:3000/api/auth/login", {
    method: "POST",
    headers: {
      Host: "localhost:3001",
      Origin: "http://localhost:3001",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  await expect(readJsonBody(input)).resolves.toEqual({});
});
it.each([
  "null",
  "not-a-url",
  "http://localhost:3000/path",
  "https://attacker.example@localhost:3000",
])("rejects malformed or non-origin values: %s", async (origin) => {
  await expect(
    readJsonBody(request("{}", { Origin: origin })),
  ).rejects.toMatchObject({ status: 403 });
});
