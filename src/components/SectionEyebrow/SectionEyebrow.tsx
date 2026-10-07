import type { ReactNode } from "react";
import styles from "./SectionEyebrow.module.css";

interface SectionEyebrowProps {
  children: ReactNode;
  alignment?: "center" | "start";
}

export const SectionEyebrow = ({
  children,
  alignment = "center",
}: SectionEyebrowProps) => (
  <p
    className={[styles.eyebrow, alignment === "start" ? styles.start : ""].join(
      " ",
    )}
  >
    {children}
  </p>
);
