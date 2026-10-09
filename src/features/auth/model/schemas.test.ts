import { describe, expect, it } from "vitest";
import { loginSchema, masterResponseSchema } from "./schemas";

describe("master login validation", () => {
  it("normalizes email and preserves the exact password", () => {
    expect(
      loginSchema.parse({
        email: "  Owner@Example.com  ",
        password: " password with spaces ",
      }),
    ).toEqual({
      email: "owner@example.com",
      password: " password with spaces ",
    });
  });
  it.each([
    { email: "invalid", password: "password" },
    { email: "owner@example.com", password: "" },
    { email: "owner@example.com", password: "p".repeat(1025) },
    { email: "owner@example.com", password: "password", role: "master" },
  ])("rejects invalid or extended credentials", (input) => {
    expect(loginSchema.safeParse(input).success).toBe(false);
  });
  it("does not accept session tokens in the public profile response", () => {
    expect(
      masterResponseSchema.safeParse({
        data: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "owner@example.com",
          access_token: "token",
        },
      }).success,
    ).toBe(false);
  });
});
