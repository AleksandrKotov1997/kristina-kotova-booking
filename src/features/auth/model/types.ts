import type { z } from "zod";
import type { loginSchema, masterProfileSchema } from "./schemas";

export type LoginInput = z.input<typeof loginSchema>;
export type LoginCredentials = z.output<typeof loginSchema>;
export type MasterProfile = z.infer<typeof masterProfileSchema>;
