import { Button } from "@/shadcn/ui/button";
import type { FC } from "react";
import { useNavigate } from "react-router";

type EmailConfirmationProps = {
  email: string;
};

export const EmailConfirmation: FC<EmailConfirmationProps> = ({ email }) => {
  const navigate = useNavigate();
  //TODO: Не работет возвра на предудыщую страницу
  //TODO: Нет стилей для страницы
  return (
    <div>
      <h3>Подтвердите регистрацию</h3>
      <span>
        На вашу почту {email} было отправлено сообщение. Перейдите по ссылке в
        письме, чтобы подтвердить регистрацию аккаунта.
      </span>
      <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
    </div>
  );
};
