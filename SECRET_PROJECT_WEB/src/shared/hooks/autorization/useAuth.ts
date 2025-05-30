import apiClient from "@/api/apiClient";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkAuth = useCallback(() => {
    try {
      const sessionToken = localStorageService.getItem("sessionToken");
      const expiresAt = localStorageService.getItem("expiresAt");

      if (!sessionToken || !expiresAt) {
        setIsLoggedIn(false);
        apiClient.sessionToken = null;
        return;
      }

      const now = new Date();
      const expiration = new Date(expiresAt);

      if (now >= expiration) {
        setIsLoggedIn(false);
        apiClient.sessionToken = null;
        localStorageService.removeItem("sessionToken");
        localStorageService.removeItem("expiresAt");
        return;
      }

      apiClient.sessionToken = sessionToken;
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      setIsLoggedIn(false);
      apiClient.sessionToken = null;
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sessionToken" || e.key === "expiresAt") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  return { 
    isLoggedIn,
    checkAuth
  };
};
