import { Badge as BadgeComponent } from "@/shadcn/ui/badge";
import type { CSSProperties } from "react";

import styles from "./styles.module.scss";
import type { Status } from "@/types/Status/Status";

type BadgeProps = {
  variant: Status;
  className?: string;
};

type GetStylesProps = {
  style: CSSProperties;
};

export const Badge = ({ variant, className }: BadgeProps) => {
  const getStyles = (): GetStylesProps => {
    switch (variant) {
      case "Online":
        return { style: { backgroundColor: "green" } };
      case "Offline":
        return { style: { backgroundColor: "gray" } };
      case "Sleeping":
        return { style: { backgroundColor: "yellow" } };
      case "NotDisturb":
        return { style: { backgroundColor: "red" } };
      default:
        return { style: { backgroundColor: "black" } };
    }
  };

  return (
    <BadgeComponent
      className={`${styles["badge"]} ${className}`}
      {...getStyles()}
    />
  );
};
