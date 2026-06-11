import { z } from "zod";

export const updateCurrentUserSchema = z.object({
  userId: z.string(),
});

export type UpdateCurrentUserRequest = z.infer<typeof updateCurrentUserSchema>;
