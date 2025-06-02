import type { FC } from "react";
import styles from "./styles.module.scss";
import avatarPlaceholder from "@/shared/icons/AvatarMockup/anonym_icon.webp";

type AvatarProps = {
  src?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const Avatar: FC<AvatarProps> = ({
  src,
  size = "medium",
  className,
  onClick,
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
      {src ? <img src={src} alt="" /> : <img src={avatarPlaceholder} alt="" />}
    </div>
  );
};
