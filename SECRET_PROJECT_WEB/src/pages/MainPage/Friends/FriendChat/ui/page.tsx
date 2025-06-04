import { useParams } from "react-router";
import styles from "./styles.module.scss";
import { MessageBlock } from "../MessageBlock/MessageBlock";
import { FriendChatHeader } from "../FriendChatHeader/FriendChatHeader";
import { useState } from "react";
import { FriendChatAudioAndVideoBlock } from "../FriendChatAudioAndVideoBlock/FriendChatAudioAndVideoBlock";

export const FriendChat = () => {
  const [isAudioAndVideoBlockOpen, setIsAudioAndVideoBlockOpen] =
    useState(false);

  const { friendId } = useParams();

  return (
    <div className={styles["friend-chat"]}>
      {isAudioAndVideoBlockOpen ? (
        <FriendChatAudioAndVideoBlock
          handleDisconnect={setIsAudioAndVideoBlockOpen.bind(null, false)}
        />
      ) : (
        <FriendChatHeader
          friendId={friendId ?? ""}
          openAudioAndVideoBlock={setIsAudioAndVideoBlockOpen.bind(null, true)}
        />
      )}
      <MessageBlock friendId={friendId ?? ""} />
    </div>
  );
};
