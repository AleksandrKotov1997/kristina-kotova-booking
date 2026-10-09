import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm/LoginForm";
import styles from "./LoginView.module.css";

export const LoginView = ({ initialError }: { initialError?: string }) => (
  <main className={styles.page}>
    <section className={styles.card} aria-labelledby="master-login-title">
      <Image
        src="/kristina-kotova-logo.svg"
        width={56}
        height={56}
        alt=""
        className={styles.logo}
      />
      <h1 id="master-login-title">Kristina Kotova Studio</h1>
      <p className={styles.subtitle}>Личный кабинет мастера</p>
      <LoginForm initialError={initialError} />
      <Link href="/" className={styles.back}>
        ← На сайт
      </Link>
    </section>
  </main>
);
