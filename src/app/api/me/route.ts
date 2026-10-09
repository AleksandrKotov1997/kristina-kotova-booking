import { NextRequest, NextResponse } from "next/server";
import {
  createAuthContext,
  type AuthContext,
} from "@/server/auth/createAuthContext";
import { getVerifiedMaster } from "@/server/auth/masterAccess";
import { authErrorResponse } from "@/server/auth/authErrors";
import { HttpRequestError } from "@/shared/http/readJsonBody";

export const GET = async (request: NextRequest) => {
  let context: AuthContext | undefined;
  try {
    context = createAuthContext(request.cookies.getAll());
    const master = await getVerifiedMaster(context);
    if (!master)
      throw new HttpRequestError(
        401,
        "AUTH_REQUIRED",
        "Войдите в кабинет мастера.",
      );
    return context.applyResponseCookies(NextResponse.json({ data: master }));
  } catch (error) {
    const response = authErrorResponse(error);
    return context ? context.applyResponseCookies(response) : response;
  }
};
