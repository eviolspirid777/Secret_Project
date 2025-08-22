import { Skeleton } from "@/shadcn/ui/skeleton";
import { StatusTranslator } from "@/shared/helpers/StatusTranslator/StatusTranslator";
import type { Status as StatusType } from "@/types/Status/Status";
import type { FC } from "react";

import styles from "./styles.module.scss";

type StatusProps = {
  status: StatusType;
  isLoading: boolean;
};

export const Status: FC<StatusProps> = ({ isLoading, status }) => {
  return (
    <span className={styles["my-profile__info-status"]}>
      {isLoading ? (
        <Skeleton className="h-[20px] w-[120px]" />
      ) : (
        StatusTranslator(status ?? "Offline")
      )}
    </span>
  );
};
