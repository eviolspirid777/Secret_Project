import { Button } from "@/shadcn/ui/button";
import type { FC } from "react";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

type EmailConfirmationProps = {
  email: string;
};

export const EmailConfirmation: FC<EmailConfirmationProps> = ({ email }) => {
  const navigate = useNavigate();

  return (
    <div className={styles["email-confirmation-container"]}>
      <h3 className={styles["email-confirmation-container__title"]}>
        Подтвердите регистрацию
      </h3>
      <span className={styles["email-confirmation-container__description"]}>
        На вашу почту {email} было отправлено сообщение. Перейдите по ссылке в
        письме, чтобы подтвердить регистрацию аккаунта.
      </span>
      <Button
        onClick={() => navigate("/autorize")}
        className={styles["email-confirmation-container__button"]}
      >
        Вернуться назад
      </Button>
    </div>
  );
};
