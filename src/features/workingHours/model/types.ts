import { z } from "zod";
import { weekdaySchema, workingDaySchema } from "./schemas";

export type Weekday = z.infer<typeof weekdaySchema>;
export type WorkingDaySchedule = z.infer<typeof workingDaySchema>;
