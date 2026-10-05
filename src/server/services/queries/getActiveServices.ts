import "server-only";

import { z } from "zod";
import type { ServicesQuery } from "@/features/services/model/types";
import { createSupabaseRestClient } from "@/shared/supabase/createSupabaseRestClient";
import { serviceRecordSchema } from "../serviceRecordSchema";
import { transformService } from "../transformers/transformService";

export const getActiveServices = async ({ category }: ServicesQuery) => {
  const supabaseClient = createSupabaseRestClient();
  const response = await supabaseClient.get<unknown>("/services", {
    params: {
      select:
        "id,category,name,description,price,duration_minutes,is_active,sort_order,created_at,updated_at",
      is_active: "eq.true",
      category: category ? "eq." + category : undefined,
      order: "sort_order.asc,name.asc,id.asc",
    },
  });

  return z
    .array(serviceRecordSchema)
    .parse(response.data)
    .map(transformService);
};
