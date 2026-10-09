import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { createAuthContext } from "./createAuthContext";
import { getVerifiedMaster } from "./masterAccess";
import { GET } from "@/app/api/me/route";

const user = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "owner@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00Z",
};
const setupSession = async (
  owner: boolean,
  userStatus = 200,
  roleStatus = 200,
  firstTokenLifetime = 3600,
) => {
  vi.stubEnv("SUPABASE_URL", "https://auth.example.com");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_unit_test");
  let tokenRequests = 0;
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/token"))
      return Response.json({
        access_token: "test-access-token-" + ++tokenRequests,
        refresh_token: "test-refresh-token",
        expires_in: tokenRequests === 1 ? firstTokenLifetime : 3600,
        token_type: "bearer",
        user,
      });
    if (url.includes("/logout")) return new Response(null, { status: 204 });
    if (url.includes("/user"))
      return Response.json(
        userStatus === 200 ? user : { message: "User verification failed" },
        { status: userStatus },
      );
    if (url.includes("/rpc/is_studio_owner"))
      return Response.json(
        roleStatus === 200 ? owner : { message: "Database unavailable" },
        { status: roleStatus },
      );
    throw new Error("Unexpected request");
  });
  vi.stubGlobal("fetch", fetchMock);
  const context = createAuthContext([]);
  const result = await context.client.auth.signInWithPassword({
    email: user.email,
    password: "test-password",
  });
  expect(result.error).toBeNull();
  return { context, fetchMock };
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("master access", () => {
  it("verifies the Auth user and the database role before returning a profile", async () => {
    const { context, fetchMock } = await setupSession(true);
    await expect(getVerifiedMaster(context)).resolves.toEqual({
      id: user.id,
      email: user.email,
    });
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).includes("/auth/v1/user"),
      ),
    ).toBe(true);
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).includes("/rpc/is_studio_owner"),
      ),
    ).toBe(true);
  });
  it("denies an authenticated user without the master role", async () => {
    const { context } = await setupSession(false);
    await expect(getVerifiedMaster(context)).resolves.toBeNull();
  });
  it("denies a revoked session even if its cookie exists", async () => {
    const { context, fetchMock } = await setupSession(true, 401);
    await expect(getVerifiedMaster(context)).resolves.toBeNull();
    expect(
      fetchMock.mock.calls.some(([url]) => String(url).includes("/rpc/")),
    ).toBe(false);
  });
  it("fails closed when the role cannot be checked", async () => {
    const { context } = await setupSession(true, 200, 500);
    await expect(getVerifiedMaster(context)).rejects.toMatchObject({
      status: 503,
      code: "AUTH_UNAVAILABLE",
    });
  });
  it("sets private cookies and disables response caching", async () => {
    const { context } = await setupSession(true);
    const request = new NextRequest("http://localhost:3000/admin");
    context.updateRequestCookies(request);
    expect(request.cookies.getAll().length).toBeGreaterThan(0);
    const response = context.applyResponseCookies(
      NextResponse.json({ success: true }),
    );
    expect(
      response.cookies
        .getAll()
        .every(
          (cookie) =>
            cookie.httpOnly && cookie.sameSite === "lax" && cookie.path === "/",
        ),
    ).toBe(true);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
  it("ignores the old demo identity cookie", async () => {
    vi.stubEnv("SUPABASE_URL", "https://auth.example.com");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_unit_test");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      getVerifiedMaster(
        createAuthContext([{ name: "currentUserId", value: user.id }]),
      ),
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("session lifecycle", () => {
  it("refreshes an expired session and forwards its new cookie", async () => {
    const { context, fetchMock } = await setupSession(true, 200, 200, 1);
    const original = context
      .applyResponseCookies(NextResponse.json({ success: true }))
      .cookies.getAll();
    await expect(getVerifiedMaster(context)).resolves.toEqual({
      id: user.id,
      email: user.email,
    });
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).includes("grant_type=refresh_token"),
      ),
    ).toBe(true);
    const refreshed = context
      .applyResponseCookies(NextResponse.json({ success: true }))
      .cookies.getAll();
    expect(refreshed.map((cookie) => cookie.value)).not.toEqual(
      original.map((cookie) => cookie.value),
    );
    const request = new NextRequest("http://localhost:3000/admin");
    context.updateRequestCookies(request);
    await expect(
      getVerifiedMaster(createAuthContext(request.cookies.getAll())),
    ).resolves.toEqual({ id: user.id, email: user.email });
  });
  it("revokes the local session and removes its cookies on logout", async () => {
    const { context, fetchMock } = await setupSession(true);
    const result = await context.client.auth.signOut({ scope: "local" });
    expect(result.error).toBeNull();
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).includes("/logout?scope=local"),
      ),
    ).toBe(true);
    const response = context.applyResponseCookies(
      NextResponse.json({ success: true }),
    );
    expect(
      response.cookies
        .getAll()
        .every((cookie) => cookie.value === "" && cookie.maxAge === 0),
    ).toBe(true);
    await expect(getVerifiedMaster(context)).resolves.toBeNull();
  });
});

describe("master profile API", () => {
  it("returns only the verified master profile", async () => {
    const { context } = await setupSession(true);
    const request = new NextRequest("http://localhost:3000/api/me");
    context.updateRequestCookies(request);
    const response = await GET(request);
    expect(response.status).toBe(200);
    const payload: unknown = await response.json();
    expect(payload).toEqual({ data: { id: user.id, email: user.email } });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
  it("rejects an Auth session without the master role", async () => {
    const { context } = await setupSession(false);
    const request = new NextRequest("http://localhost:3000/api/me");
    context.updateRequestCookies(request);
    expect((await GET(request)).status).toBe(401);
  });
  it("sets Secure on production session cookies", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { context } = await setupSession(true);
    const response = context.applyResponseCookies(
      NextResponse.json({ success: true }),
    );
    expect(
      response.cookies
        .getAll()
        .every((cookie) => cookie.secure && cookie.httpOnly),
    ).toBe(true);
  });
});
