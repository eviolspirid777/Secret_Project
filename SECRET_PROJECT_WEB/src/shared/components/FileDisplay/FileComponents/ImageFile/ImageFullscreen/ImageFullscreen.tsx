import type { FC } from "react";
import { createPortal } from "react-dom";

import styles from "./ImageFullscreen.module.scss";

type ImageFullscreenProps = {
  src: string | undefined;
  onBackgroundClick?: () => void;
};

export const ImageFullscreen: FC<ImageFullscreenProps> = ({
  src,
  onBackgroundClick,
}) => {
  return createPortal(
    <div
      className={styles["image-block__background"]}
      onClick={onBackgroundClick}
    >
      <img className={styles["image-block__image"]} src={src} />
    </div>,
    document.getElementById("root")!
  );
};
