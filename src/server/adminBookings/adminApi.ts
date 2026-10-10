import "server-only";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import {
  createAuthContext,
  type AuthContext,
} from "@/server/auth/createAuthContext";
import { getVerifiedMaster } from "@/server/auth/masterAccess";
import { HttpRequestError } from "@/shared/http/readJsonBody";

const databaseErrorSchema = z.object({ message: z.string() });
const failures = {
  ACCESS_DENIED: {
    status: 403,
    message: "Доступ к кабинету закрыт. Войдите снова.",
  },
  BOOKING_NOT_FOUND: {
    status: 404,
    message: "Запись не найдена. Обновите список.",
  },
  STATUS_CONFLICT: {
    status: 409,
    message:
      "Статус уже изменён в другой вкладке. Обновите список и проверьте запись.",
  },
  INVALID_TRANSITION: {
    status: 400,
    message: "Этот переход статуса недоступен.",
  },
  INVALID_FILTERS: { status: 400, message: "Проверьте фильтры списка." },
};
const databaseCodeSchema = z.enum([
  "ACCESS_DENIED",
  "BOOKING_NOT_FOUND",
  "STATUS_CONFLICT",
  "INVALID_TRANSITION",
  "INVALID_FILTERS",
]);
export const adminErrorResponse = (error: unknown) => {
  let failure = new HttpRequestError(
    503,
    "ADMIN_UNAVAILABLE",
    "Не удалось выполнить запрос. Обновите список и попробуйте ещё раз.",
  );
  if (error instanceof HttpRequestError) failure = error;
  else {
    const parsed = databaseErrorSchema.safeParse(error);
    const code = databaseCodeSchema.safeParse(
      parsed.success ? parsed.data.message : undefined,
    );
    if (code.success) {
      const details = failures[code.data];
      failure = new HttpRequestError(
        details.status,
        code.data,
        details.message,
      );
    }
  }
  return NextResponse.json(
    { error: { code: failure.code, message: failure.message } },
    {
      status: failure.status,
      headers: { "Cache-Control": "private, no-store", Pragma: "no-cache" },
    },
  );
};
export const withMasterApi = async (
  request: NextRequest,
  action: (context: AuthContext) => Promise<NextResponse>,
) => {
  let context: AuthContext | undefined;
  try {
    context = createAuthContext(request.cookies.getAll());
    if (!(await getVerifiedMaster(context)))
      throw new HttpRequestError(
        401,
        "AUTH_REQUIRED",
        "Войдите в кабинет мастера.",
      );
    return context.applyResponseCookies(await action(context));
  } catch (error) {
    const response = adminErrorResponse(error);
    return context ? context.applyResponseCookies(response) : response;
  }
};
