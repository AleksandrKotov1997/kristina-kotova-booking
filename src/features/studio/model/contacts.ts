import { studioContactsSchema } from "./schemas";

export const studioContacts = studioContactsSchema.parse({
  phone: null,
  whatsappNumber: null,
  telegramUsername: null,
  instagramUsername: null,
  location: null,
});
