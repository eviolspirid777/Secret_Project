import { Loader } from "@/shared/components/Loader/loader";
import { Suspense } from "react";
import { Outlet } from "react-router";

import styles from "./styles.module.scss";

export const Display = () => {
  return (
    <div className={styles["main"]}>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};
