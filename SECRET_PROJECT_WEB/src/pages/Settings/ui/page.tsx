import { useNavigate, Outlet } from "react-router";
import { IoArrowBackOutline } from "react-icons/io5";
import { NavigateMenu } from "../NavigateMenu/NavigateMenu";

import styles from "./styles.module.scss";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useUserInformation } from "@/shared/hooks/user/useUserInformation";
import { useEffect } from "react";
import { setUser } from "@/store/slices/User.slice";
import { useDispatch } from "react-redux";

export const Page = () => {
  const dispatch = useDispatch();

  //TODO: Зачем запрашивается еще раз???
  const { userInformation, isSuccessUserInformation } = useUserInformation(
    localStorageService.getUserId() ?? ""
  );

  useEffect(() => {
    if (userInformation) {
      dispatch(setUser(userInformation));
    }
  }, [isSuccessUserInformation]);

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
