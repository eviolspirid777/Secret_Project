import { Button } from "@/shadcn/ui/button";

import styles from "./styles.module.scss";
import type { FC } from "react";

type ActionButtonsProps = {
  handleDecline: () => void;
  handleSave: () => void;
};

export const ActionButtons: FC<ActionButtonsProps> = ({
  handleDecline,
  handleSave,
}) => {
  return (
    <div className={styles["my-profile__controls-buttons"]}>
      <Button variant="destructive" onClick={handleDecline}>
        Отменить
      </Button>
      <Button variant="default" onClick={handleSave}>
        Сохранить
      </Button>
    </div>
  );
};
