import { useTranslations } from "next-intl";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import styles from "./MasterIntroduction.module.css";

interface MasterIntroductionProps {
  headingId: string;
}

export const MasterIntroduction = ({ headingId }: MasterIntroductionProps) => {
  const t = useTranslations("About");
  return (
    <div>
      <SectionEyebrow alignment="start">{t("title")}</SectionEyebrow>
      <h2 className={styles.title} id={headingId}>
        {t("hello")} <em>{t("name")}</em>
      </h2>
      <div className={styles.description}>
        <p>{t("introduction")}</p>
        <p>{t("approach")}</p>
      </div>
    </div>
  );
};
