import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { useNavigate } from "react-router";
import { useLogout } from "@/shared/hooks/autorization/useLogout";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { toast } from "sonner";

import styles from "./styles.module.scss";

export const NavigateMenu = () => {
  const navigate = useNavigate();
  const { logoutAsync } = useLogout();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    const id = localStorageService.getUserId();
    if (id) {
      await logoutAsync(id);
      navigate("/autorize");
    } else {
      toast.error("Не удалось выйти из системы");
    }
  };

  return (
    <NavigationMenu className={styles["navigate-menu"]}>
      <NavigationMenuList className={styles["navigate-menu__list"]}>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={styles["navigate-menu__link"]}
            onClick={() => handleNavigate("/settings/profile")}
          >
            Профиль
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={styles["navigate-menu__link"]}
            onClick={() => handleNavigate("/settings/security")}
          >
            Безопасность
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${styles["navigate-menu__link"]} ${styles["exit-button"]}`}
            onClick={handleLogout}
          >
            Выйти
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
