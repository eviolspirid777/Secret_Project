import apiClient from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  const {
    mutateAsync: logoutAsync,
    isPending: isLogoutPending,
    isError: isLogoutError,
    error: logoutError,
  } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await apiClient.Logout();
      return response;
    },
  });

  return {
    logoutAsync,
    isLogoutPending,
    isLogoutError,
    logoutError,
  };
};
