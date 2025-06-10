import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

import styles from "./styles.module.scss";

type AddingProps = {
  channelName: string;
  setChannelName: (value: string) => void;
  createChannel: () => void;
  isAddChannelPending: boolean;
};

export const Adding = ({
  channelName,
  setChannelName,
  createChannel,
  isAddChannelPending,
}: AddingProps) => {
  return (
    <div className={styles["create-channel"]}>
      <Input
        placeholder="Введите название канала"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        className={styles["create-channel__input"]}
      />
      <Button
        className={styles["create-channel__button"]}
        onClick={createChannel}
        disabled={isAddChannelPending}
      >
        Создать канал
      </Button>
    </div>
  );
};
