import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { BookingFlow } from "@/features/booking/components/BookingFlow/BookingFlow";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import styles from "./BookingView.module.css";

interface BookingViewProps {
  selectionRequest: ServiceSelectionRequest;
}

export const BookingView = ({ selectionRequest }: BookingViewProps) => (
  <>
    <PublicPageHeading
      eyebrow="Онлайн-запись"
      title="Запись на процедуру"
      description="Выберите услугу, дату и удобное время. После отправки заявки Кристина подтвердит запись."
    />
    <section className={styles.selection} aria-label="Онлайн-запись">
      <PageContainer>
        <BookingFlow
          key={
            selectionRequest.status === "requested"
              ? selectionRequest.serviceId
              : selectionRequest.status
          }
          selectionRequest={selectionRequest}
        />
      </PageContainer>
    </section>
  </>
);
