import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/getCurrentUser";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};
