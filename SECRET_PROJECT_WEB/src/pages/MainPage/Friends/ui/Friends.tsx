import { Search } from "../Search/Search";
import { FriendsList } from "../FriendsList/FriendsList";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router";
import { useGetUserFriends } from "@/shared/hooks/user/friendship/useGetUserFriends";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { setFriends } from "@/store/slices/Friends.slice";

export const Friends = () => {
  const dispatch = useDispatch();
  const { userFriends, userFriendsSuccess } = useGetUserFriends(
    localStorageService.getUserId() ?? ""
  );

  useEffect(() => {
    if (userFriendsSuccess && userFriends) {
      dispatch(setFriends(userFriends));
    }
  }, [userFriendsSuccess]);

  const friends = useSelector((state: RootState) => state.friends);
  const [filteredFriends, setFilteredFriends] = useState(friends);

  useEffect(() => {
    if (friends) {
      setFilteredFriends(friends);
    }
  }, [friends]);

  const handleSearch = (value: string) => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const navigate = useNavigate();

  const handleAddFriend = () => {
    navigate("/add-friend");
  };

  return (
    <div className={styles["friends"]}>
      <div className={styles["friends__header"]}>
        <Search onChange={handleSearch} />
        <IoMdPersonAdd
          className={styles["friends__header-icon"]}
          size={30}
          onClick={handleAddFriend}
        />
      </div>
      <FriendsList friends={filteredFriends} />
    </div>
  );
};
