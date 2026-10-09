import { serviceCategoryOptions } from "@/features/services/model/constants";
import type { Service } from "@/features/services/model/types";
import { formatPrice } from "@/shared/format/formatPrice";
import styles from "./BookingServicePicker.module.css";
interface BookingServicePickerProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (service: Service) => void;
}
export const BookingServicePicker = ({
  services,
  selectedServiceId,
  onSelect,
}: BookingServicePickerProps) => (
  <div className={styles.categories}>
    {serviceCategoryOptions
      .filter((category) =>
        services.some((service) => service.category === category.value),
      )
      .map((category) => (
        <section key={category.value} aria-label={category.label}>
          <h3 className={styles.category}>{category.label}</h3>
          <div className={styles.grid}>
            {services
              .filter((service) => service.category === category.value)
              .map((service) => (
                <button
                  type="button"
                  key={service.id}
                  className={[
                    styles.option,
                    selectedServiceId === service.id ? styles.selected : "",
                  ].join(" ")}
                  aria-pressed={selectedServiceId === service.id}
                  onClick={() => onSelect(service)}
                >
                  <span className={styles.name}>{service.name}</span>
                  <span className={styles.details}>
                    {service.durationMinutes} мин · от{" "}
                    {formatPrice(service.price)}
                  </span>
                </button>
              ))}
          </div>
        </section>
      ))}
  </div>
);
