import { Input } from "@/shadcn/ui/input";

import styles from "./styles.module.scss";
import { Button } from "@/shadcn/ui/button";

type JoiningProps = {
  channelId: string;
  setChannelId: (value: string) => void;
  handleSendFriendRequest: () => void;
  isJoinChannelPending: boolean;
};

export const Joining = ({
  channelId,
  setChannelId,
  handleSendFriendRequest,
  isJoinChannelPending,
}: JoiningProps) => {
  return (
    <div className={styles["join-channel"]}>
      <Input
        placeholder="Введите id канала"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        className={styles["join-channel__input"]}
      />
      <Button onClick={handleSendFriendRequest} disabled={isJoinChannelPending}>
        Присоединиться
      </Button>
    </div>
  );
};
