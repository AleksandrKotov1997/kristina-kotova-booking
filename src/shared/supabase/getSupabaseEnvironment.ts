import "server-only";
import { z } from "zod";

const supabaseEnvironmentSchema = z.object({
  url: z.url({ protocol: /^https$/ }),
  publishableKey: z.string().trim().startsWith("sb_publishable_"),
});

export const getSupabaseEnvironment = () =>
  supabaseEnvironmentSchema.parse({
    url: process.env.SUPABASE_URL,
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  });
