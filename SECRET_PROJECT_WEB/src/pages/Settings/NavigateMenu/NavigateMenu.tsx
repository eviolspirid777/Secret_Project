import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

export const NavigateMenu = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
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
        {/* Добавь другие пункты меню */}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
