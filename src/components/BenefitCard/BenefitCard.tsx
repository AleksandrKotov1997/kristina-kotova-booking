import type { MasterBenefit } from "@/features/master/model/types";
import styles from "./BenefitCard.module.css";

interface BenefitCardProps {
  benefit: MasterBenefit;
}

export const BenefitCard = ({ benefit }: BenefitCardProps) => (
  <li className={styles.card}>
    <span className={styles.icon} aria-hidden="true">
      {benefit.icon}
    </span>
    <h3 className={styles.title}>{benefit.title}</h3>
    <p className={styles.description}>{benefit.description}</p>
  </li>
);
