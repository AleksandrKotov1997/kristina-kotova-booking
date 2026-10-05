import type { z } from "zod";
import type {
  serviceCategorySchema,
  serviceSchema,
  servicesQuerySchema,
} from "./schemas";

export type ServiceCategory = z.infer<typeof serviceCategorySchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ServicesQuery = z.infer<typeof servicesQuerySchema>;
