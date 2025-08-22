import { Adding } from "../Adding/ui";
import { Joining } from "../Joining/ui";

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
