import { useNavigate, Outlet } from "react-router";
import { IoArrowBackOutline } from "react-icons/io5";
import { NavigateMenu } from "../NavigateMenu/ui";

import styles from "./styles.module.scss";

export const Page = () => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate("/");
  };

  return (
    <div className={styles["settings-page-container"]}>
      <IoArrowBackOutline
        className={styles["back-button"]}
        size={30}
        onClick={handleNavigateBack}
      />
      <div className={styles["settings-page-container__content"]}>
        <NavigateMenu />
        <Outlet />
      </div>
    </div>
  );
};
