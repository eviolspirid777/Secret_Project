import { Button } from "@/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import styles from "./style.module.scss";
import { useLogin } from "@/shared/hooks/autorization/useLogin";
import { Loader } from "@/shared/components/Loader/loader";
import { Error } from "./Error/error";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type PageProps = {
  onRegister: () => void;
};

export const Page: FC<PageProps> = ({ onRegister }) => {
  const { loginAsync, isLoginPending, isLoginError, loginError, resetLogin } =
    useLogin();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    await loginAsync({
      email: data.email,
      password: data.password,
    });
    navigate("/main-content");
  };

  const handleResetLogin = () => {
    resetLogin();
    form.resetField("password");
    form.resetField("email");
  };

  if (isLoginPending) return <Loader />;
  if (isLoginError)
    return (
      <Error error={loginError as AxiosError} resetStates={handleResetLogin} />
    );

  return (
    <div
      className={`w-100 flex flex-col gap-4 items-center justify-center ${styles.autorize}`}
    >
      <h3 className="text-2xl font-bold">Вход в систему</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-100 flex flex-col gap-4 items-center justify-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input placeholder="Пароль" {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Button type="submit">Войти</Button>
            <Button variant="link" onClick={onRegister}>
              Регистрация
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
