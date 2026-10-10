import { SectionEyebrow } from "@/components/SectionEyebrow";
import styles from "./MasterIntroduction.module.css";

interface MasterIntroductionProps {
  headingId: string;
}

export const MasterIntroduction = ({ headingId }: MasterIntroductionProps) => (
  <div>
    <SectionEyebrow alignment="start">О мастере</SectionEyebrow>
    <h2 className={styles.title} id={headingId}>
      Привет, я <em>Кристина</em>
    </h2>
    <div className={styles.description}>
      <p>
        Я мастер по наращиванию и ламинированию ресниц и бровей в Астане. Уже
        несколько лет помогаю девушкам просыпаться с красивым взглядом каждый
        день — без лишних усилий по утрам.
      </p>
      <p>
        Для меня важны аккуратность, индивидуальный подход и комфорт клиента.
        Каждый визит — это не просто процедура, а время для себя в уютной
        атмосфере.
      </p>
    </div>
  </div>
);
