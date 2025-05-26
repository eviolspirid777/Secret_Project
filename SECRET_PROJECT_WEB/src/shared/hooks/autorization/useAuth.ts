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

  /*TODO: тут вынести из useEffect в UseState выше и добавить метод на беке
  для проверки ликвидности токена из localStorage
  и если токен не ликвиден, то удалять его из localStorage
  */
  useEffect(() => {
    apiClient.sessionToken = null;

    if (localStorageService.getItem("sessionToken")) {
      apiClient.sessionToken = localStorageService.getItem("sessionToken");
    }
  }, []);

  return { isLoggedIn };
};
