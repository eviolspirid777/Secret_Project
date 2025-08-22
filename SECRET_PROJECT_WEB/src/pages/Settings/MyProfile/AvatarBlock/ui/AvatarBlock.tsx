import type { FC } from "react";
import styles from "./styles.module.scss";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { FaPencilAlt } from "react-icons/fa";
import type { Status } from "@/types/Status/Status";
import { Badge } from "@/shared/components/Badge/Badge";
import { Avatar } from "@/shared/components/Avatar/Avatar";

type AvatarBlockProps = {
  isLoading: boolean;
  isEditing: boolean;
  isUserAvatarLoading: boolean;
  avatar: string;
  status: Status;
  handleEditAvatar: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleChangeAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AvatarBlock: FC<AvatarBlockProps> = ({
  isEditing,
  isLoading,
  isUserAvatarLoading,
  avatar,
  status,
  fileInputRef,
  handleEditAvatar,
  handleChangeAvatar,
}) => {
  return (
    <div className={styles["my-profile__avatar-block"]}>
      {isLoading ? (
        <Skeleton className="h-[100px] w-[100px] rounded-full" />
      ) : (
        <>
          <Avatar
            src={avatar}
            size="large"
            className={`${styles["my-profile__avatar"]} ${
              isEditing && styles["my-profile__avatar-editing"]
            }`}
            onClick={isEditing ? handleEditAvatar : undefined}
            loading={isUserAvatarLoading}
          />
          {isEditing && (
            <>
              <FaPencilAlt
                className={styles["my-profile__avatar-pencil"]}
                onClick={() => fileInputRef.current?.click()}
                size={30}
              />
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleChangeAvatar}
                style={{
                  display: "none",
                }}
              />
            </>
          )}
          <Badge className={styles["my-profile__badge"]} variant={status} />
        </>
      )}
    </div>
  );
};
