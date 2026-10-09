import { isAxiosError } from "axios";
import { z } from "zod";
const bookingErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});
export const getBookingError = (error: unknown) => {
  if (isAxiosError<unknown>(error)) {
    const result = bookingErrorSchema.safeParse(error.response?.data);
    if (result.success) return result.data.error;
  }
  return {
    code: "UNAVAILABLE",
    message:
      "Не удалось отправить заявку. Проверьте соединение и попробуйте снова. Повторная отправка не создаст вторую запись.",
  };
};
