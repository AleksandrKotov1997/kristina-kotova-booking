import type { MasterProfile } from "@/features/auth/model/types";
import styles from "./MasterAccountView.module.css";

interface MasterAccountViewProps {
  master: MasterProfile;
}

export const MasterAccountView = ({ master }: MasterAccountViewProps) => (
  <section className={styles.account} aria-labelledby="account-title">
    <h1 id="account-title" className={styles.title}>
      Кабинет мастера
    </h1>
    <div className={styles.card}>
      <h2 className={styles.subtitle}>Учётная запись</h2>
      <dl className={styles.details}>
        <div>
          <dt>Email</dt>
          <dd>{master.email}</dd>
        </div>
      </dl>
    </div>
  </section>
);
