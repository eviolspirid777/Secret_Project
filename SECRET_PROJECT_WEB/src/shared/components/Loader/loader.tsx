import styles from "./styles.module.scss";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className={styles["loader"]}></span>
    </div>
  );
};
