"use client";

import Link from "next/link";
import { Button } from "antd";
import styles from "@/views/LoginView/LoginView.module.css";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="admin-error-title">
        <h1 id="admin-error-title">Кабинет недоступен</h1>
        <p className={styles.subtitle}>
          Не удалось проверить доступ. Попробуйте ещё раз.
        </p>
        <Button type="primary" className={styles.retry} onClick={reset}>
          Повторить
        </Button>
        <div>
          <Link href="/" className={styles.back}>
            ← На сайт
          </Link>
        </div>
      </section>
    </main>
  );
}
