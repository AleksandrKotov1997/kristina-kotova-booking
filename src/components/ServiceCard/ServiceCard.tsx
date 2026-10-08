import Link from "next/link";
import type { Service } from "@/features/services/model/types";
import { formatPrice } from "@/shared/format/formatPrice";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: Service;
  headingLevel?: 2 | 3;
}

export const ServiceCard = ({
  service,
  headingLevel = 3,
}: ServiceCardProps) => {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <Heading className={styles.title}>{service.name}</Heading>
        <span className={styles.price}>от {formatPrice(service.price)}</span>
      </div>
      <p className={styles.description}>{service.description}</p>
      <div className={styles.footer}>
        <span className={styles.duration}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {service.durationMinutes} мин
        </span>
        <Link
          className={styles.bookingLink}
          href={{ pathname: "/booking", query: { serviceId: service.id } }}
          aria-label={"Записаться: " + service.name}
        >
          Записаться
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
