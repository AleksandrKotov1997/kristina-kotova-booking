"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { getAuthErrorMessage } from "../../api/authApi";
import { useLogin } from "../../hooks/useAuthActions";
import { loginSchema } from "../../model/schemas";
import type { LoginInput, LoginCredentials } from "../../model/types";
import styles from "./LoginForm.module.css";

export const LoginForm = ({ initialError }: { initialError?: string }) => {
  const login = useLogin();
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginInput, undefined, LoginCredentials>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
  const error = login.isError ? getAuthErrorMessage(login.error) : initialError;
  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={handleSubmit((credentials) =>
        login.mutate(credentials, { onSettled: () => resetField("password") }),
      )}
    >
      <div className={styles.field}>
        <label htmlFor="master-email">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="master-email"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={254}
              readOnly={login.isPending}
              status={errors.email ? "error" : undefined}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "master-email-error" : undefined}
            />
          )}
        />
        {errors.email && (
          <p id="master-email-error" className={styles.error} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="master-password">Пароль</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              id="master-password"
              autoComplete="current-password"
              maxLength={1024}
              readOnly={login.isPending}
              status={errors.password ? "error" : undefined}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "master-password-error" : undefined
              }
            />
          )}
        />
        {errors.password && (
          <p id="master-password-error" className={styles.error} role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      {error && <Alert type="error" title={error} showIcon role="alert" />}
      <Button
        type="primary"
        htmlType="submit"
        loading={login.isPending}
        block
        className={styles.submit}
      >
        Войти
      </Button>
    </form>
  );
};
