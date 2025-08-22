import { Button } from "@/shadcn/ui/button";
import { Loader } from "lucide-react";
import type { FC } from "react";

import styles from "./styles.module.scss";

type EditButtonProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

export const EditButton: FC<EditButtonProps> = ({
  isLoading,
  setIsEditing,
  isEditing,
}) => {
  return (
    <Button
      variant="default"
      onClick={setIsEditing.bind(null, !isEditing)}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className={styles["loading-button"]} />
      ) : (
        "Редактировать"
      )}
    </Button>
  );
};
