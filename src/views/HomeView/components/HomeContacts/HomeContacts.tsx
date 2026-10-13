import { useLocale, useTranslations } from "next-intl";
import { PublicActionLink } from "@/components/ActionLink";
import { ContactItem } from "@/components/ContactItem";
import { PageContainer } from "@/components/PageContainer";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { WorkingHours } from "@/components/WorkingHours";
import { studioContacts } from "@/features/studio/model/contacts";
import { ContactIcon } from "./ContactIcon";
import styles from "./HomeContacts.module.css";

export const HomeContacts = () => {
  const t = useTranslations("Contacts");
  const navigation = useTranslations("Navigation");
  const locale = useLocale();
  const common = useTranslations("Common");
  return (
    <section
      id="contacts"
      className={styles.section}
      aria-labelledby="contacts-title"
    >
      <PageContainer className={styles.layout}>
        <div>
          <SectionEyebrow alignment="start" tone="inverse">
            {navigation("contacts")}
          </SectionEyebrow>
          <h2 className={styles.title} id="contacts-title">
            {t("title")} <em>{t("accent")}</em>
          </h2>
          <p className={styles.description}>{t("description")}</p>
          <PublicActionLink href="/booking">
            {common("bookOnline")} <span aria-hidden="true">→</span>
          </PublicActionLink>
        </div>
        <div className={styles.card}>
          <ul className={styles.contactList} aria-label={t("methods")}>
            <ContactItem
              icon={<ContactIcon name="instagram" />}
              label="Instagram"
              value={
                studioContacts.instagramUsername
                  ? "@" + studioContacts.instagramUsername
                  : t("linkPending")
              }
              description={t("instagramDescription")}
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
                  : t("linkPending")
              }
              description={t("telegramDescription")}
              href={
                studioContacts.telegramUsername
                  ? "https://t.me/" + studioContacts.telegramUsername
                  : undefined
              }
              external
            />
            <ContactItem
              icon={<ContactIcon name="phone" />}
              label={t("phone")}
              value={
                studioContacts.phone?.displayNumber ??
                studioContacts.whatsappNumber ??
                t("contactPending")
              }
              href={
                studioContacts.phone
                  ? "tel:" + studioContacts.phone.internationalNumber
                  : undefined
              }
              description={t("phoneDescription")}
            >
              {studioContacts.whatsappNumber && (
                <a
                  className={styles.whatsappLink}
                  href={
                    "https://wa.me/" + studioContacts.whatsappNumber.slice(1)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("whatsapp")}
                </a>
              )}
            </ContactItem>
          </ul>
          <ul className={styles.addressList} aria-label={t("addressLabel")}>
            <ContactItem
              icon={<ContactIcon name="location" />}
              label={t("address")}
              value={
                studioContacts.location
                  ? t("fullAddress", {
                      city: studioContacts.location.city,
                      address:
                        locale === "kk"
                          ? studioContacts.location.addressKk
                          : studioContacts.location.address,
                    })
                  : t("addressPending")
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
};
