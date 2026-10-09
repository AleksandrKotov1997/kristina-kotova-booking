"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut } from "../api/authApi";

export const useLogin = () =>
  useMutation({
    mutationFn: signIn,
    retry: false,
    gcTime: 0,
    onSuccess: () => window.location.replace("/admin"),
  });
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    retry: false,
    gcTime: 0,
    onSuccess: () => {
      queryClient.clear();
      window.location.replace("/admin/login");
    },
  });
};
