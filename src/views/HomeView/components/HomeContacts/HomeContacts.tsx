import { studioCity } from "@/features/studio/model/constants";
import { ActionLink } from "@/components/ActionLink";
import { ContactItem } from "@/components/ContactItem";
import { PageContainer } from "@/components/PageContainer";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { WorkingHours } from "@/components/WorkingHours";
import { studioContacts } from "@/features/studio/model/contacts";
import { ContactIcon } from "./ContactIcon";
import styles from "./HomeContacts.module.css";

export const HomeContacts = () => (
  <section
    id="contacts"
    className={styles.section}
    aria-labelledby="contacts-title"
  >
    <PageContainer className={styles.layout}>
      <div>
        <SectionEyebrow alignment="start" tone="inverse">
          Контакты
        </SectionEyebrow>
        <h2 className={styles.title} id="contacts-title">
          Готовы к <em>красивому взгляду?</em>
        </h2>
        <p className={styles.description}>
          Запишитесь онлайн — буду рада видеть вас!
        </p>
        <ActionLink href="/booking">
          Записаться онлайн <span aria-hidden="true">→</span>
        </ActionLink>
      </div>
      <div className={styles.card}>
        <ul className={styles.contactList} aria-label="Способы связи">
          <ContactItem
            icon={<ContactIcon name="instagram" />}
            label="Instagram"
            value={
              studioContacts.instagramUsername
                ? "@" + studioContacts.instagramUsername
                : "Ссылка уточняется"
            }
            description="Фото работ, сторис и новости"
            href={
              studioContacts.instagramUsername
                ? "https://www.instagram.com/" +
                  studioContacts.instagramUsername +
                  "/"
                : undefined
            }
            external
          />
          <ContactItem
            icon={<ContactIcon name="telegram" />}
            label="Telegram"
            value={
              studioContacts.telegramUsername
                ? "@" + studioContacts.telegramUsername
                : "Ссылка уточняется"
            }
            description="Написать напрямую"
            href={
              studioContacts.telegramUsername
                ? "https://t.me/" + studioContacts.telegramUsername
                : undefined
            }
            external
          />
          <ContactItem
            icon={<ContactIcon name="phone" />}
            label="Телефон / WhatsApp"
            value={
              studioContacts.phone?.displayNumber ??
              studioContacts.whatsappNumber ??
              "Контакт уточняется"
            }
            href={
              studioContacts.phone
                ? "tel:" + studioContacts.phone.internationalNumber
                : undefined
            }
            description="Звонки и сообщения"
          >
            {studioContacts.whatsappNumber && (
              <a
                className={styles.whatsappLink}
                href={"https://wa.me/" + studioContacts.whatsappNumber.slice(1)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать в WhatsApp
              </a>
            )}
          </ContactItem>
        </ul>
        <ul className={styles.addressList} aria-label="Адрес кабинета">
          <ContactItem
            icon={<ContactIcon name="location" />}
            label="Адрес"
            value={
              studioContacts.location
                ? "г. " +
                  studioContacts.location.city +
                  ", " +
                  studioContacts.location.address
                : "г. " + studioCity + ", адрес уточняется"
            }
          >
            {studioContacts.location && (
              <div className={styles.directions}>
                {studioContacts.location.directions.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
          </ContactItem>
        </ul>
        <WorkingHours />
      </div>
    </PageContainer>
  </section>
);
