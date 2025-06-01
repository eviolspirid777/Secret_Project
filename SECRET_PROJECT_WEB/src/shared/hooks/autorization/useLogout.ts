import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  const {
    mutateAsync: logoutAsync,
    isPending: isLogoutPending,
    isError: isLogoutError,
    error: logoutError,
  } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async (id: string) => {
      const response = await apiClient.Logout(id);
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
