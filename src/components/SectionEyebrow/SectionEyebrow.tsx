import type { ReactNode } from "react";
import styles from "./SectionEyebrow.module.css";

interface SectionEyebrowProps {
  children: ReactNode;
  alignment?: "center" | "start";
  tone?: "default" | "inverse";
}

export const SectionEyebrow = ({
  children,
  alignment = "center",
  tone = "default",
}: SectionEyebrowProps) => (
  <p
    className={[
      styles.eyebrow,
      alignment === "start" ? styles.start : "",
      tone === "inverse" ? styles.inverse : "",
    ].join(" ")}
  >
    {children}
  </p>
);
