import { Search } from "./Search/Search";
import { FriendsList } from "./FriendsList/FriendsList";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const Friends = () => {
  const friends = useSelector((state: RootState) => state.friends);

  return (
    <div>
      <Search />
      <FriendsList friends={friends} />
    </div>
  );
};
