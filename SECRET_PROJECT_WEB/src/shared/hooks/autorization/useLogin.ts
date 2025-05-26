import apiClient from "@/api/apiClient";
import type { LoginRequest } from "@/types/Autorization/Autorization";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const {
    mutateAsync: loginAsync,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
    reset: resetLogin,
  } = useMutation({
    mutationKey: ["autorize"],
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.Login(data);
      return response;
    },
  });

  return {
    loginAsync,
    isLoginPending,
    isLoginError,
    loginError,
    resetLogin,
  };
};
