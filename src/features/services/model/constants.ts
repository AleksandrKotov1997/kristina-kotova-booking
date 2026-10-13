import type { ServiceCategory } from "./types";

interface ServiceCategoryOption {
  value: ServiceCategory;
}

export const serviceCategoryOptions: ServiceCategoryOption[] = [
  { value: "lashes" },
  { value: "brows" },
];

export const servicesQueryKey = ["services"];
