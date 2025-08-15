import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { useUserInformation } from "@/shared/hooks/user/useUserInformation";
import { Loader } from "@/shared/components/Loader/loader";
import { CallDrawer } from "../CallDrawer/CallDrawer";
import { MainInformation } from "../MainInformation/ui/MainInformation";

export const Page = () => {
  /*TODO:
    Вот тут должна быть проверка на текущего пользователя. Чтобы подставлялись его данные.(можно хранить в localStorage id пользователя)
    Если пользователь не авторизован, то перенаправлять на страницу авторизации.
    Если авторизован, то запрашивать данные пользователя и подставлять их в компоненты.
  */

  const { userInformation, isLoadingUserInformation, errorUserInformation } =
    useUserInformation(localStorageService.getUserId());

  if (isLoadingUserInformation) return <Loader />;
  if (errorUserInformation) return <ErrorPage />;

  return (
    <>
      <MainInformation userInformation={userInformation} />
      <CallDrawer />
    </>
  );
};
