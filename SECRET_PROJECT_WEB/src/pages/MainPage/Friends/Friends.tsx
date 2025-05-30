import { Search } from "./Search/Search";
import { FriendsList } from "./FriendsList/FriendsList";

export const Friends = () => {
  return (
    <div>
      <Search />
      <FriendsList friends={[]} />
    </div>
  );
};
