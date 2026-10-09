"use client";
import { Alert, Button } from "antd";
import { getAuthErrorMessage } from "../../api/authApi";
import { useLogout } from "../../hooks/useAuthActions";
import styles from "./LogoutButton.module.css";

export const LogoutButton = () => {
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Button onClick={() => logout.mutate()} loading={logout.isPending}>
        Выйти
      </Button>
      {logout.isError && (
        <Alert
          type="error"
          title={getAuthErrorMessage(logout.error)}
          showIcon
          role="alert"
        />
      )}
    </div>
  );
};
