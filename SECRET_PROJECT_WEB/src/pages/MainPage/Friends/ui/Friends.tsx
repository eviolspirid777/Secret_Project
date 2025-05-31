import { Search } from "../Search/Search";
import { FriendsList } from "../FriendsList/FriendsList";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState } from "react";

import styles from "./styles.module.scss";

export const Friends = () => {
  const friends = useSelector((state: RootState) => state.friends);
  const [filteredFriends, setFilteredFriends] = useState(friends);

  const handleSearch = (value: string) => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className={styles["friends"]}>
      <Search onChange={handleSearch} />
      <FriendsList friends={filteredFriends} />
    </div>
  );
};
