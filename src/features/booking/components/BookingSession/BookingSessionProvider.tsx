"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import type {
  BookingContacts,
  BookingReceipt,
  BookingSlot,
  CreateBookingInput,
} from "../../model/types";
export type BookingDraft = {
  selectionKey: string | null;
  step: 1 | 2 | 3;
  serviceId: string | null;
  date: string | null;
  slot: BookingSlot | null;
  contacts: BookingContacts;
  receipt: BookingReceipt | null;
};
export const createEmptyBookingDraft = (): BookingDraft => ({
  selectionKey: null,
  step: 1,
  serviceId: null,
  date: null,
  slot: null,
  contacts: { clientName: "", clientPhone: "" },
  receipt: null,
});
type BookingSession = {
  draft: BookingDraft;
  setDraft: Dispatch<SetStateAction<BookingDraft>>;
  lastRequestRef: RefObject<CreateBookingInput | null>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};
const BookingSessionContext = createContext<BookingSession | null>(null);
export const BookingSessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [draft, setDraft] = useState(createEmptyBookingDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastRequestRef = useRef<CreateBookingInput | null>(null);
  return (
    <BookingSessionContext.Provider
      value={{ draft, setDraft, lastRequestRef, isSubmitting, setIsSubmitting }}
    >
      {children}
    </BookingSessionContext.Provider>
  );
};
export const useBookingSession = () => {
  const session = useContext(BookingSessionContext);
  if (!session) throw new Error("BookingSessionProvider is required.");
  return session;
};
