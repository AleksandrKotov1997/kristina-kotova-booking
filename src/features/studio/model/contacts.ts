import { studioContactsSchema } from "./schemas";
import { studioCity } from "./constants";

export const studioContacts = studioContactsSchema.parse({
  phone: {
    internationalNumber: "+77028438931",
    displayNumber: "+7 (702) 843-89-31",
  },
  whatsappNumber: "+77028438931",
  telegramUsername: "kotova_kristinaaa",
  instagramUsername: "lash_kralialia",
  location: {
    city: studioCity,
    address: "ул. Ұлы Дала, 33/1",
    directions: [],
  },
});
