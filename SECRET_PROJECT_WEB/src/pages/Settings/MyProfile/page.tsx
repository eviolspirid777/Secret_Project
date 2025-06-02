import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import styles from "./styles.module.scss";
import { Badge } from "@/shared/components/Badge/Badge";
import { Button } from "@/shadcn/ui/button";
import { StatusTranslator } from "@/shared/helpers/StatusTranslator/StatusTranslator";
import { useState } from "react";
import { toast } from "sonner";
import { FaPencilAlt } from "react-icons/fa";
import { Input } from "@/shadcn/ui/input";
import { changeName } from "@/store/slices/User.slice";
import { useDispatch } from "react-redux";
import { Avatar } from "@/shared/components/Avatar/Avatar";
import { useChangeUserInformation } from "@/shared/hooks/user/useChangeUserInformation";

export const MyProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const { changeUserInformationAsync } = useChangeUserInformation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const response = await changeUserInformationAsync({
        name,
        userId: user.userId,
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
    setName(user.name);
  };

  const handleEditAvatar = () => {};

  return (
    <div className={styles["my-profile"]}>
      <div className={styles["my-profile__avatar-block"]}>
        <div>
          <Avatar
            src={user.avatar}
            size="large"
            className={`${styles["my-profile__avatar"]} ${
              isEditing && styles["my-profile__avatar-editing"]
            }`}
            onClick={isEditing ? handleEditAvatar : undefined}
          />
          {isEditing && (
            <FaPencilAlt
              className={styles["my-profile__avatar-pencil"]}
              size={30}
            />
          )}
          <Badge
            className={styles["my-profile__badge"]}
            variant={user.status}
          />
        </div>
      </div>
      <div className={styles["my-profile__info"]}>
        {isEditing ? (
          <Input
            className={styles["my-profile__info-name-input"]}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h3 className={styles["my-profile__info-name"]}>{user.name}</h3>
        )}
        <span className={styles["my-profile__info-status"]}>
          {StatusTranslator(user.status)}
        </span>
      </div>
      <div className={styles["my-profile__controls"]}>
        {isEditing ? (
          <div className={styles["my-profile__controls-buttons"]}>
            <Button variant="destructive" onClick={handleDecline}>
              Отменить
            </Button>
            <Button variant="default" onClick={handleSave}>
              Сохранить
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            onClick={setIsEditing.bind(null, !isEditing)}
          >
            Редактировать
          </Button>
        )}
      </div>
    </div>
  );
};
