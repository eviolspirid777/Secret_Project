import { Button } from "@/shadcn/ui/button";
import type { FC } from "react";
import { useNavigate } from "react-router";

type EmailConfirmationProps = {
  email: string;
};

export const EmailConfirmation: FC<EmailConfirmationProps> = ({ email }) => {
  const navigate = useNavigate();
  return (
    <div>
      <h3>Подтвердите регистрацию</h3>
      <span>
        На вашу почту {email} было отправлено сообщение. Перейдите по ссылке в
        письме, чтобы подтвердить регистрацию аккаунта.
      </span>
      <Button onClick={() => navigate("/autorize")}>Вернуться назад</Button>
    </div>
  );
};
