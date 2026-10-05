import type { ReactNode } from "react";
import styles from "./PageContainer.module.css";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withVerticalPadding?: boolean;
}

export const PageContainer = ({
  children,
  className = "",
  withVerticalPadding = false,
}: PageContainerProps) => {
  const paddingClass = withVerticalPadding ? styles.padded : "";

  return (
    <div className={`${styles.container} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};
