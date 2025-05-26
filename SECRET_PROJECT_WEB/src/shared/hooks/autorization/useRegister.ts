import apiClient from "@/api/apiClient";
import type { RegisterRequest } from "@/types/Autorization/Register";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  const {
    mutateAsync: registerAsync,
    isPending: isRegisterPending,
    isError: isRegisterError,
    error: registerError,
    reset: resetRegister,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.Register(data);
      return response;
    },
  });

  return {
    registerAsync,
    isRegisterPending,
    isRegisterError,
    registerError,
    resetRegister,
  };
};
