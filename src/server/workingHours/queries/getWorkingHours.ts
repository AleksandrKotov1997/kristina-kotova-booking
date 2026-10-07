import "server-only";

import { z } from "zod";
import { workingHoursSchema } from "@/features/workingHours/model/schemas";
import { createSupabaseRestClient } from "@/shared/supabase/createSupabaseRestClient";
import { workingHoursRecordSchema } from "../workingHoursRecordSchema";
import { transformWorkingHours } from "../transformers/transformWorkingHours";

export const getWorkingHours = async () => {
  const supabaseClient = createSupabaseRestClient();
  const response = await supabaseClient.get<unknown>("/working_hours", {
    params: {
      select: "id,day_of_week,start_time,end_time,is_working_day",
      order: "day_of_week.asc",
    },
  });

  const days = z
    .array(workingHoursRecordSchema)
    .parse(response.data)
    .map(transformWorkingHours);

  return workingHoursSchema.parse(days);
};
