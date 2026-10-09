import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/model/schemas";
import { readJsonBody, HttpRequestError } from "@/shared/http/readJsonBody";
import {
  createAuthContext,
  type AuthContext,
} from "@/server/auth/createAuthContext";
import { getVerifiedMaster } from "@/server/auth/masterAccess";
import {
  authErrorResponse,
  authUnavailable,
  invalidCredentials,
} from "@/server/auth/authErrors";

export const POST = async (request: NextRequest) => {
  let context: AuthContext | undefined;
  try {
    const input = loginSchema.safeParse(await readJsonBody(request));
    if (!input.success)
      throw new HttpRequestError(
        400,
        "INVALID_LOGIN",
        "Введите корректный email и пароль.",
      );
    context = createAuthContext(request.cookies.getAll());
    const { error } = await context.client.auth.signInWithPassword(input.data);
    if (error) {
      if (error.status === 429)
        throw new HttpRequestError(
          429,
          "TOO_MANY_ATTEMPTS",
          "Слишком много попыток входа. Подождите и попробуйте снова.",
        );
      if (error.status && [400, 401, 403, 422].includes(error.status))
        throw invalidCredentials();
      throw authUnavailable();
    }
    const master = await getVerifiedMaster(context);
    if (!master) {
      await context.client.auth.signOut({ scope: "local" });
      throw invalidCredentials();
    }
    return context.applyResponseCookies(NextResponse.json({ data: master }));
  } catch (error) {
    const response = authErrorResponse(error);
    return context ? context.applyResponseCookies(response) : response;
  }
};
