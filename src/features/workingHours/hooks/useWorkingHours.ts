import { useQuery } from "@tanstack/react-query";
import { getWorkingHours } from "../api/getWorkingHours";
import { workingHoursQueryKey } from "../model/constants";

export const useWorkingHours = () =>
  useQuery({
    queryKey: workingHoursQueryKey,
    queryFn: ({ signal }) => getWorkingHours(signal),
    staleTime: 60_000,
    retry: 1,
  });
