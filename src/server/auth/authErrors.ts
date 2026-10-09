import { NextResponse } from "next/server";
import { HttpRequestError } from "@/shared/http/readJsonBody";

export const authUnavailable = () =>
  new HttpRequestError(
    503,
    "AUTH_UNAVAILABLE",
    "Не удалось связаться с сервисом входа. Попробуйте ещё раз.",
  );
export const invalidCredentials = () =>
  new HttpRequestError(
    401,
    "INVALID_CREDENTIALS",
    "Не удалось войти. Проверьте email и пароль.",
  );
export const authErrorResponse = (error: unknown) => {
  const failure = error instanceof HttpRequestError ? error : authUnavailable();
  return NextResponse.json(
    { error: { code: failure.code, message: failure.message } },
    {
      status: failure.status,
      headers: { "Cache-Control": "private, no-store" },
    },
  );
};
