import type { NextRequest } from "next/server";

export class HttpRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
export const readJsonBody = async (request: NextRequest): Promise<unknown> => {
  const originHeader = request.headers.get("origin");
  let origin: URL | undefined;
  try {
    if (originHeader) origin = new URL(originHeader);
  } catch {
    // Malformed origins are rejected below.
  }
  // Host retains the public port when Next.js runs behind Docker's port mapping.
  const host = request.headers.get("host") ?? request.nextUrl.host;
  if (
    !origin ||
    !["http:", "https:"].includes(origin.protocol) ||
    origin.origin !== originHeader ||
    origin.host !== host.toLowerCase()
  )
    throw new HttpRequestError(
      403,
      "INVALID_ORIGIN",
      "Используйте форму на сайте.",
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new HttpRequestError(
      415,
      "INVALID_CONTENT_TYPE",
      "Ожидаются данные в формате JSON.",
    );
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 4096)
    throw new HttpRequestError(
      413,
      "PAYLOAD_TOO_LARGE",
      "Размер запроса слишком большой.",
    );
  try {
    return JSON.parse(body);
  } catch {
    throw new HttpRequestError(
      400,
      "INVALID_BODY",
      "Некорректный формат запроса.",
    );
  }
};
