import "server-only";
import axios from "axios";
import { getSupabaseEnvironment } from "./getSupabaseEnvironment";

export const createSupabaseRestClient = () => {
  const environment = getSupabaseEnvironment();
  return axios.create({
    baseURL: environment.url.replace(/[/]$/, "") + "/rest/v1",
    headers: { apikey: environment.publishableKey },
    timeout: 10_000,
  });
};
