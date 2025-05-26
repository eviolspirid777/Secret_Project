import { Button } from "@/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./style.module.scss";
import { useRegister } from "@/shared/hooks/autorization/useRegister";
import { Loader } from "@/shared/components/Loader/loader";
import { Error } from "./Error/error";
import { useLogin } from "@/shared/hooks/autorization/useLogin";
import { useNavigate } from "react-router";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type PageProps = {
  onAutorize: () => void;
};

export const Page: FC<PageProps> = ({ onAutorize }) => {
  const navigate = useNavigate();
  const {
    registerAsync,
    isRegisterPending,
    isRegisterError,
    registerError,
    resetRegister,
  } = useRegister();
  const { loginAsync, isLoginPending, isLoginError } = useLogin();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await registerAsync({
        email: data.email,
        displayName: data.email,
        password: data.password,
      });
      await loginAsync({
        email: data.email,
        password: data.password,
      });
      navigate("/main-content");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetRegister = () => {
    resetRegister();
    form.resetField("password");
    form.resetField("confirmPassword");
  };

  if (isRegisterPending || isLoginPending) return <Loader />;
  if (isRegisterError || isLoginError)
    return <Error error={registerError} resetStates={handleResetRegister} />;

  return (
    <div
      className={`w-100 flex flex-col gap-4 items-center justify-center ${styles["register-page-container"]}`}
    >
      <h3 className="text-2xl font-bold">Регистрация</h3>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтвердите пароль</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Подтвердите пароль"
                    {...field}
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Button type="submit">Зарегестрироваться</Button>
            <Button variant="link" onClick={onAutorize}>
              Авторизация
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
