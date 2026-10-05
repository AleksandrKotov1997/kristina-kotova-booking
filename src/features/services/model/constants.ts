import type { ServiceCategory } from "./types";

interface ServiceCategoryOption {
  value: ServiceCategory;
  label: string;
}

export const serviceCategoryOptions: ServiceCategoryOption[] = [
  { value: "lashes", label: "Ресницы" },
  { value: "brows", label: "Брови" },
];

export const servicesQueryKey = ["services"];
