import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readJsonBody, HttpRequestError } from "@/shared/http/readJsonBody";
import {
  createAuthContext,
  type AuthContext,
} from "@/server/auth/createAuthContext";
import { authErrorResponse, authUnavailable } from "@/server/auth/authErrors";

export const POST = async (request: NextRequest) => {
  let context: AuthContext | undefined;
  try {
    if (!z.strictObject({}).safeParse(await readJsonBody(request)).success)
      throw new HttpRequestError(
        400,
        "INVALID_BODY",
        "Некорректный запрос выхода.",
      );
    context = createAuthContext(request.cookies.getAll());
    const { error } = await context.client.auth.signOut({ scope: "local" });
    if (error) throw authUnavailable();
    return context.applyResponseCookies(NextResponse.json({ success: true }));
  } catch (error) {
    const response = authErrorResponse(error);
    return context ? context.applyResponseCookies(response) : response;
  }
};
