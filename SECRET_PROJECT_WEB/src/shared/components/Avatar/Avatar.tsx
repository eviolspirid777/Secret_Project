import type { FC } from "react";
import styles from "./styles.module.scss";
import avatarPlaceholder from "/icons/AvatarMockup/anonym_icon.webp";
import { Loader } from "../Loader/loader";

type AvatarProps = {
  src?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  loading?: boolean;
};

export const Avatar: FC<AvatarProps> = ({
  src,
  size = "medium",
  className,
  onClick,
  loading = false,
}) => {
  const avatarSize = (() => {
    switch (size) {
      case "small":
        return "35px";
      case "medium":
        return "65px";
      case "large":
        return "105px";
    }
  })();

  return (
    <div
      className={`${styles["avatar-block"]} ${className}`}
      style={{
        width: avatarSize,
        height: avatarSize,
      }}
      onClick={onClick}
    >
      {loading ? (
        <Loader height="screen" />
      ) : (
        <img src={src ? src : avatarPlaceholder} alt="" />
      )}
    </div>
  );
};
