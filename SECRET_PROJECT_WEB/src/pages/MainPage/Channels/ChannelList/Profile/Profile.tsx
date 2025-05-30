import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <div
      className={styles["profile-container"]}
      onClick={() => navigate("/my-profile")}
    >
      <img
        src="https://avatars.mds.yandex.net/get-yapic/63032/8ATPndJL2v9vXFwpqtisTne88aw-1/orig"
        alt=""
      />
    </div>
  );
};
