import apiClient from "@/api/apiClient";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useState } from "react";
import { useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const sessionToken = localStorageService.getItem("sessionToken");
    const expiresAt = localStorageService.getItem("expiresAt");
    if (sessionToken && expiresAt) {
      apiClient.sessionToken = sessionToken;
      const now = new Date();
      const expiration = new Date(expiresAt);
      if (now < expiration) {
        setIsLoggedIn(true);
        return;
      }
    }
    setIsLoggedIn(false);
    apiClient.sessionToken = null;
  }, []);

  return { isLoggedIn };
};
