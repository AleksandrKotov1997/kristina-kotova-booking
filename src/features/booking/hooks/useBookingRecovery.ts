import { useCallback, useEffect, useState } from "react";
import { resolveBookingRequest } from "../api/bookingApi";
import {
  clearPendingBookingRequest,
  readPendingBookingRequest,
  savePendingBookingRequest,
} from "../model/pendingBookingRequest";
import type { BookingReceipt } from "../model/types";

type RecoveryState =
  | { status: "checking" }
  | { status: "ready"; receipt: BookingReceipt | null; wasNotCreated: boolean }
  | { status: "error"; message: string };

const checkPendingRequest = async (): Promise<RecoveryState> => {
  let requestId: string | null;
  try {
    requestId = readPendingBookingRequest();
  } catch {
    return {
      status: "error",
      message:
        "Браузер не позволяет сохранить результат отправки. Разрешите хранение данных для сайта и повторите проверку.",
    };
  }
  if (!requestId)
    return { status: "ready", receipt: null, wasNotCreated: false };
  try {
    const receipt = await resolveBookingRequest(requestId);
    if (!receipt) clearPendingBookingRequest();
    return { status: "ready", receipt, wasNotCreated: !receipt };
  } catch {
    return {
      status: "error",
      message:
        "Не удалось проверить предыдущую отправку. Проверьте соединение и повторите проверку, прежде чем создавать новую заявку.",
    };
  }
};

export const useBookingRecovery = () => {
  const [state, setState] = useState<RecoveryState>({ status: "checking" });
  useEffect(() => {
    let active = true;
    void checkPendingRequest().then((result) => {
      if (active) setState(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const checkResult = useCallback(async () => {
    setState({ status: "checking" });
    const result = await checkPendingRequest();
    setState(result);
    return result;
  }, []);
  const rememberRequest = (requestId: string) => {
    try {
      savePendingBookingRequest(requestId);
      return true;
    } catch {
      setState({
        status: "error",
        message:
          "Заявка не отправлена: браузер не позволяет сохранить идентификатор попытки. Разрешите хранение данных для сайта и повторите проверку.",
      });
      return false;
    }
  };
  const forgetRequest = () => {
    try {
      clearPendingBookingRequest();
    } catch {
      setState({
        status: "error",
        message:
          "Браузер не позволяет завершить предыдущую попытку. Разрешите хранение данных для сайта и повторите проверку.",
      });
    }
  };
  return { state, checkResult, rememberRequest, forgetRequest };
};
