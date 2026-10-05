import "server-only";

import axios from "axios";
import { z } from "zod";

const supabaseEnvironmentSchema = z.object({
  url: z.url({ protocol: /^https$/ }),
  publishableKey: z.string().trim().startsWith("sb_publishable_"),
});

export const createSupabaseRestClient = () => {
  const environment = supabaseEnvironmentSchema.parse({
    url: process.env.SUPABASE_URL,
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  });

  return axios.create({
    baseURL: environment.url.replace(/\/$/, "") + "/rest/v1",
    headers: { apikey: environment.publishableKey },
    timeout: 10_000,
  });
};
