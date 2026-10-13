import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { BookingFlow } from "@/features/booking/components/BookingFlow/BookingFlow";
import type { ServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import styles from "./BookingView.module.css";

interface BookingViewProps {
  selectionRequest: ServiceSelectionRequest;
}

export const BookingView = ({ selectionRequest }: BookingViewProps) => {
  const t = useTranslations("Booking");
  return (
    <>
      <PublicPageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className={styles.selection} aria-label={t("eyebrow")}>
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
};
