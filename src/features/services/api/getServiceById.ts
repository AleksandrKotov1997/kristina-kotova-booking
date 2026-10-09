import { getServices } from "./getServices";

export const getServiceById = async (
  serviceId: string,
  signal?: AbortSignal,
) => {
  const services = await getServices({}, signal);

  return (
    services.find((service) => service.id === serviceId && service.isActive) ??
    null
  );
};
