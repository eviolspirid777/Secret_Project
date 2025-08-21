import { Input } from "@/shadcn/ui/input";
import { memo, type FC } from "react";

import styles from "./styles.module.scss";

type SearchProps = {
  onChange: (value: string) => void;
};

export const Search: FC<SearchProps> = memo(({ onChange }) => {
  return (
    <div className={styles["search"]}>
      <Input
        className={styles["search__input"]}
        placeholder="Поиск друзей"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
});
