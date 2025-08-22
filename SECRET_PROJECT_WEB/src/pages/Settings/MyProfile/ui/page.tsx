import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/shadcn/ui/input";
import { changeName, setUser } from "@/store/slices/User.slice";
import { useDispatch } from "react-redux";
import { useChangeUserInformation } from "@/shared/hooks/user/useChangeUserInformation";
import { useChangeUserAvatar } from "@/shared/hooks/user/useChangeUserAvatar";
import { useUserInformation } from "@/shared/hooks/user/useUserInformation";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { EditButton } from "../EditButton/ui";
import { ActionButtons } from "../ActionButtons/ui";
import { Status } from "../Status/ui";
import { UserName } from "../UserName/ui";
import { AvatarBlock } from "../AvatarBlock/ui";

export const MyProfile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const {
    userInformation,
    isSuccessUserInformation,
    isLoadingUserInformation,
  } = useUserInformation(localStorageService.getUserId() ?? "");

  useEffect(() => {
    if (userInformation) {
      dispatch(setUser(userInformation));
    }
  }, [isSuccessUserInformation]);

  const { changeUserInformationAsync } = useChangeUserInformation();
  const { changeUserAvatar, isUserAvatarLoading } = useChangeUserAvatar();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name);

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const response = await changeUserInformationAsync({
        name,
        userId: user?.userId ?? "",
      });
      if (response.status === 200) {
        dispatch(changeName(name));
        setName(name);
        toast.success("Успешно сохранено!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ошибка при сохранении!");
    }
  };

  const handleDecline = () => {
    setIsEditing(false);
    setName(user?.name);
  };

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user?.userId ?? "");
      changeUserAvatar(formData);
    }
  };

  const handleEditAvatar = () => {
    setIsEditing(true);
    fileInputRef.current?.click();
  };

  return (
    <div className={styles["my-profile"]}>
      <AvatarBlock
        avatar={user.avatar}
        fileInputRef={fileInputRef}
        handleChangeAvatar={handleChangeAvatar}
        handleEditAvatar={handleEditAvatar}
        isEditing={isEditing}
        isLoading={isLoadingUserInformation}
        isUserAvatarLoading={isUserAvatarLoading}
        status={user.status}
      />
      <div className={styles["my-profile__info"]}>
        {isEditing ? (
          <Input
            className={styles["my-profile__info-name-input"]}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <UserName isLoading={isLoadingUserInformation} userName={user.name} />
        )}
        <Status isLoading={isLoadingUserInformation} status={user.status} />
      </div>
      <div className={styles["my-profile__controls"]}>
        {isEditing ? (
          <ActionButtons
            handleDecline={handleDecline}
            handleSave={handleSave}
          />
        ) : (
          <EditButton
            isEditing={isEditing}
            isLoading={isLoadingUserInformation}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
};
