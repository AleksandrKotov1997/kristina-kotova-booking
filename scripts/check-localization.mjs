import assert from "node:assert/strict";
const baseUrl =
  process.env.LOCALIZATION_TEST_BASE_URL ?? "http://localhost:3000";
const request = (path, locale = "ru") =>
  fetch(baseUrl + path, {
    headers: { Cookie: "studio.locale=" + locale, "Accept-Language": "kk" },
    redirect: "manual",
  });
const pageTitles = {
  ru: [
    "Ресницы, которые говорят за вас",
    "Услуги",
    "Работы",
    "О мастере",
    "Запись на процедуру",
  ],
  kk: [
    "Сіз үшін сөйлейтін кірпіктер",
    "Қызметтер",
    "Жұмыстар",
    "Шебер туралы",
    "Процедураға жазылу",
  ],
};
const paths = ["/", "/services", "/works", "/about", "/booking"];
for (const locale of ["ru", "kk"]) {
  for (const [index, path] of paths.entries()) {
    const localizedPath =
      locale === "kk" ? "/kk" + (path === "/" ? "" : path) : path;
    const response = await request(localizedPath, locale);
    assert.equal(
      response.status,
      200,
      localizedPath + " must render without a redirect loop",
    );
    const html = await response.text();
    assert.match(
      html,
      new RegExp('<html[^>]*lang="' + locale + '"'),
      localizedPath,
    );
    const heading = html
      .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    assert.equal(heading, pageTitles[locale][index], localizedPath);
    assert.equal(response.headers.get("x-frame-options"), "DENY");
  }
}
const reopen = await request("/", "kk");
assert.equal(reopen.status, 307);
assert.equal(new URL(reopen.headers.get("location"), baseUrl).pathname, "/kk");
const explicitRussian = await request("/ru/services", "kk");
assert.equal(explicitRussian.status, 307);
assert.equal(
  new URL(explicitRussian.headers.get("location"), baseUrl).pathname,
  "/services",
);
assert.match(explicitRussian.headers.get("set-cookie"), /studio\.locale=ru/);
assert.match(explicitRussian.headers.get("set-cookie"), /Max-Age=31536000/i);
for (const resource of ["services", "gallery"]) {
  const russianResponse = await request("/api/" + resource + "?locale=ru");
  const kazakhResponse = await request("/api/" + resource + "?locale=kk");
  assert.equal(russianResponse.status, 200);
  assert.equal(kazakhResponse.status, 200);
  const russian = (await russianResponse.json()).data;
  const kazakh = (await kazakhResponse.json()).data;
  assert.ok(russian.length > 0);
  assert.deepEqual(
    kazakh.map((item) => item.id),
    russian.map((item) => item.id),
  );
  if (resource === "services") {
    assert.deepEqual(
      kazakh.map((item) => [item.price, item.durationMinutes]),
      russian.map((item) => [item.price, item.durationMinutes]),
    );
    assert.ok(kazakh.every((item) => item.name && item.description));
    assert.ok(kazakh.some((item, index) => item.name !== russian[index].name));
  } else assert.ok(kazakh.every((item) => item.title));
  assert.equal((await request("/api/" + resource + "?locale=kz")).status, 400);
  assert.equal(
    (await request("/api/" + resource + "?locale=ru&locale=kk")).status,
    400,
  );
}
for (const locale of ["ru", "kk"]) {
  const unknown = await request(
    (locale === "kk" ? "/kk" : "") + "/localization-check-unknown",
    locale,
  );
  assert.equal(unknown.status, 404);
  assert.match(
    await unknown.text(),
    locale === "kk" ? /Бет табылмады/ : /Страница не найдена/,
  );
}
const admin = await request("/admin", "kk");
assert.equal(admin.status, 307);
assert.equal(
  new URL(admin.headers.get("location"), baseUrl).pathname,
  "/admin/login",
);
assert.equal((await request("/api/admin/dashboard", "kk")).status, 401);
console.log(
  "Localization: 10 public pages, SSR languages, persistent choice, Russian return, catalogs, validation, translated 404 and protected admin passed.",
);
