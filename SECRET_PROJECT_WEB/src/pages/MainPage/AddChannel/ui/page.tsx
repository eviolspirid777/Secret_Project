import { Adding } from "../Adding/Adding";
import { Joining } from "../Joining/Joining";

import styles from "./styles.module.scss";

export const Page = () => {
  return (
    <div className={styles["add-channel-page"]}>
      <Joining />
      <hr className={styles["separator"]} />
      <Adding />
    </div>
  );
};
