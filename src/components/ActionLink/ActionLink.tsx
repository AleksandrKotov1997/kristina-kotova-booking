import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./ActionLink.module.css";

interface ActionLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "regular" | "compact";
}

export const ActionLink = ({
  href,
  children,
  variant = "primary",
  size = "regular",
}: ActionLinkProps) => {
  return (
    <Link
      href={href}
      className={`${styles.link} ${styles[variant]} ${styles[size]}`}
    >
      {children}
    </Link>
  );
};
