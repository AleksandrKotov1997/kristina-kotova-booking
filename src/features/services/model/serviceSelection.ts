import { serviceSchema } from "./schemas";

export type ServiceSelectionRequest =
  | { status: "empty" }
  | { status: "invalid" }
  | { status: "requested"; serviceId: string };

export const parseServiceSelectionRequest = (
  value: unknown,
): ServiceSelectionRequest => {
  if (value === undefined) {
    return { status: "empty" };
  }

  const serviceId = serviceSchema.shape.id.safeParse(value);

  return serviceId.success
    ? { status: "requested", serviceId: serviceId.data }
    : { status: "invalid" };
};
