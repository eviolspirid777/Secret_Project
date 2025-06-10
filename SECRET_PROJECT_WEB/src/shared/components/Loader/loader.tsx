import { cn } from "@/shadcn/lib/utils";
import styles from "./styles.module.scss";

type LoaderProps = {
  className?: string;
  height?: "full" | "screen";
};

export const Loader = ({ className, height = "full" }: LoaderProps) => {
  return (
    <div
      className={cn(styles["loader-container"], className)}
      style={{ height: height === "full" ? "100vh" : "100%" }}
    >
      <span className={styles["loader"]}></span>
    </div>
  );
};
