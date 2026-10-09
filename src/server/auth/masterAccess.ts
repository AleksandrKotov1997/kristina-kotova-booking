import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isAuthApiError,
  isAuthSessionMissingError,
} from "@supabase/supabase-js";
import { masterProfileSchema } from "@/features/auth/model/schemas";
import { createAuthContext, type AuthContext } from "./createAuthContext";
import { authUnavailable } from "./authErrors";

export const getVerifiedMaster = async (context: AuthContext) => {
  const { data, error } = await context.client.auth.getUser();
  if (error) {
    if (
      isAuthSessionMissingError(error) ||
      (isAuthApiError(error) && [400, 401, 403].includes(error.status))
    )
      return null;
    throw authUnavailable();
  }
  if (!data.user?.email) return null;
  const access = await context.client.rpc("is_studio_owner");
  if (access.error) throw authUnavailable();
  if (access.data !== true) return null;
  return masterProfileSchema.parse({
    id: data.user.id,
    email: data.user.email,
  });
};

// Proxy refreshes cookies before Server Components; no session is shared across requests.
export const getCurrentMaster = cache(async () => {
  const cookieStore = await cookies();
  return getVerifiedMaster(createAuthContext(cookieStore.getAll()));
});
export const requireMaster = async () => {
  const master = await getCurrentMaster();
  if (!master) redirect("/admin/login");
  return master;
};
