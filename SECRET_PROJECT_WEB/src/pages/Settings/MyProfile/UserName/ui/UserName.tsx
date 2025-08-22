import { Skeleton } from "@/shadcn/ui/skeleton";
import type { FC } from "react";

import styles from "./styles.module.scss";

type UserNameProps = {
  isLoading: boolean;
  userName: string;
};

export const UserName: FC<UserNameProps> = ({ isLoading, userName }) => {
  if (isLoading) {
    return <Skeleton className="h-[20px] w-[170px] my-3" />;
  }

  return <h3 className={styles["name"]}>{userName}</h3>;
};
