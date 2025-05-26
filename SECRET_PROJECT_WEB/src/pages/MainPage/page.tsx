import { useSelector } from "react-redux";
import { ChannelList } from "./ChannelList/ChannelList";
import { OutletDisplay } from "./OutletDisplay/OutletDisplay";
import type { RootState } from "@/store/store";

import styles from "./styles.module.scss";

export const Page = () => {
  const channels = useSelector((state: RootState) => state.channels.channels);

  return (
    <div className={styles["main-page-container"]}>
      <h1>Secret Project</h1>
      <div className={styles["main-page-container-content"]}>
        <ChannelList channels={channels} />
        <OutletDisplay />
      </div>
    </div>
  );
};
