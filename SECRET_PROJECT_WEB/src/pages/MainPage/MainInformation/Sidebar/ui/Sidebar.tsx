import { ChannelList } from "../Channels/ChannelList/ui/ChannelList";
import { ShortProfile } from "../Profile/ShortProfile/ShortProfile";
import styles from "./styles.module.scss";

export const Sidebar = () => {
  return (
    <div className={styles["side-bar"]}>
      <ChannelList />
      <ShortProfile />
    </div>
  );
};
