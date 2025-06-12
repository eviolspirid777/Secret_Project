import { Button } from "@/shadcn/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { FaPhone, FaVideo } from "react-icons/fa";

import styles from "./styles.module.scss";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { getFriendById } from "@/store/slices/Friends.slice";
import type { FC } from "react";
import { VscCallIncoming } from "react-icons/vsc";

type FriendChatHeaderProps = {
  friendId: string;
  openAudioAndVideoBlock: (type: "audio" | "video") => void;
  roomId: string | null;
  connectToCall: () => Promise<void>;
};

export const FriendChatHeader: FC<FriendChatHeaderProps> = ({
  friendId,
  openAudioAndVideoBlock,
  connectToCall,
  roomId,
}) => {
  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );

  const handleConnectToCall = () => {
    connectToCall();
  };

  return (
    <div className={styles["friend-chat__header"]}>
      <Avatar className={styles["friend-chat__header-avatar"]}>
        <AvatarImage src={friend?.avatar} />
        <AvatarFallback>
          {friend?.name
            ?.split(" ")
            .map((name, index) => {
              if ([0, 1].includes(index)) return name[0];
            })
            .join("")}
        </AvatarFallback>
      </Avatar>
      <h1 className={styles["friend-chat__header-name"]}>{friend?.name}</h1>
      {roomId ? (
        <div className={styles["friend-chat__header-actions"]}>
          <Button
            onClick={handleConnectToCall}
            className={styles["friend-chat__header-actions__connect"]}
          >
            <VscCallIncoming />
          </Button>
        </div>
      ) : (
        <div className={styles["friend-chat__header-actions"]}>
          <Button onClick={openAudioAndVideoBlock.bind(null, "audio")}>
            <FaPhone />
          </Button>
          <Button onClick={openAudioAndVideoBlock.bind(null, "video")}>
            <FaVideo />
          </Button>
        </div>
      )}
    </div>
  );
};
