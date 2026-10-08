import type { ReactNode } from "react";
import styles from "./ContactItem.module.css";

interface ContactItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  description?: string;
  href?: string;
  external?: boolean;
  children?: ReactNode;
}

export const ContactItem = ({
  icon,
  label,
  value,
  description,
  href,
  external = false,
  children,
}: ContactItemProps) => (
  <li className={styles.item}>
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
    <div className={styles.content}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </p>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  </li>
);
