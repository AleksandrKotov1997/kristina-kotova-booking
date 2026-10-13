import { describe, expect, it } from "vitest";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./routing";
import { localeCookieMaxAge, localeCookieName, localeSchema } from "./locales";
import ru from "./messages/ru.json";
import kk from "./messages/kk.json";
const messageEntries = (messages: object, prefix = ""): [string, string][] =>
  Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "string"
      ? [[prefix + key, value]]
      : messageEntries(value, prefix + key + "."),
  );
describe("public language routing", () => {
  const handle = createMiddleware(routing);
  it("retains the saved Kazakh preference and preserves booking query parameters", () => {
    const response = handle(
      new NextRequest("https://example.com/booking?serviceId=test", {
        headers: { cookie: localeCookieName + "=kk", "accept-language": "ru" },
      }),
    );
    expect(response.headers.get("location")).toBe(
      "https://example.com/kk/booking?serviceId=test",
    );
  });
  it("makes an explicit language URL override the saved preference and persist across browser sessions", () => {
    const response = handle(
      new NextRequest("https://example.com/kk/works", {
        headers: { cookie: localeCookieName + "=ru" },
      }),
    );
    const cookie = response.cookies.get(localeCookieName);
    expect(cookie?.value).toBe("kk");
    expect(cookie?.maxAge).toBe(localeCookieMaxAge);
    expect(cookie?.path).toBe("/");
    expect(cookie?.sameSite).toBe("lax");
  });
  it("returns to an existing Russian address when Russian is explicitly selected", () => {
    const response = handle(
      new NextRequest("https://example.com/ru/services", {
        headers: { cookie: localeCookieName + "=kk" },
      }),
    );
    expect(response.headers.get("location")).toBe(
      "https://example.com/services",
    );
    expect(response.cookies.get(localeCookieName)?.value).toBe("ru");
  });
  it("accepts only the two supported languages", () => {
    expect(localeSchema.safeParse("kz").success).toBe(false);
    expect(localeSchema.safeParse("en").success).toBe(false);
  });
  it("has matching translations and interpolation parameters for every public message", () => {
    const russian = messageEntries(ru);
    const kazakh = new Map(messageEntries(kk));
    expect([...kazakh.keys()].sort()).toEqual(
      russian.map(([key]) => key).sort(),
    );
    for (const [key, message] of russian) {
      const translation = kazakh.get(key);
      expect(translation?.trim(), key).toBeTruthy();
      expect(translation?.match(/\{[^}]+\}/g)?.sort() ?? [], key).toEqual(
        message.match(/\{[^}]+\}/g)?.sort() ?? [],
      );
    }
  });
});
