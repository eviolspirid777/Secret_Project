import type { MessageReaction } from "@/types/Message/Message";
import styles from "./styles.module.scss";
import type { FC } from "react";

type ReactionBlockType = {
  reactions: Partial<Record<string, MessageReaction[]>>;
  handleAddReaction: (smile: string) => Promise<void>;
};

export const ReactionBlock: FC<ReactionBlockType> = ({
  reactions,
  handleAddReaction,
}) => {
  return (
    <div className={styles["reactions-block"]}>
      {Object.keys(reactions).map((el) => (
        <div
          key={el}
          className={styles["reactions-block__reaction"]}
          onClick={handleAddReaction.bind(null, el)}
        >
          {el} {reactions[el]?.length}
        </div>
      ))}
    </div>
  );
};
