import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

export const SectionHeading = ({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) => (
  <div className={styles.heading}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 className={styles.title} id={id}>
      {title}
    </h2>
    <p className={styles.description}>{description}</p>
  </div>
);
