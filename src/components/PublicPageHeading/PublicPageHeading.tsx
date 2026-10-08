import type { ReactNode } from "react";
import { PageContainer } from "@/components/PageContainer";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import styles from "./PublicPageHeading.module.css";

interface PublicPageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export const PublicPageHeading = ({
  eyebrow,
  title,
  description,
  actions,
}: PublicPageHeadingProps) => (
  <header className={styles.heading}>
    <PageContainer>
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </PageContainer>
  </header>
);
