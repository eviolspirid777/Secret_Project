import { Badge as BadgeComponent } from "@/shadcn/ui/badge";
import type { FriendStatus } from "@/types/Friend/Friend";
import type { CSSProperties } from "react";

import styles from "./styles.module.scss";

type BadgeProps = {
  variant: FriendStatus;
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
