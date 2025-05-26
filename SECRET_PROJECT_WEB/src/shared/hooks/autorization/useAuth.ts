import apiClient from "@/api/apiClient";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useState } from "react";
import { useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn] = useState(() => {
    const token = apiClient.sessionToken;
    if (token) return true;
    return false;
  });

  useEffect(() => {
    apiClient.sessionToken = null;

    if (localStorageService.getItem("sessionToken")) {
      apiClient.sessionToken = localStorageService.getItem("sessionToken");
    }
  }, []);

  return { isLoggedIn };
};
