export type Role = "manager" | "operator";

export interface CurrentUser {
  id: string;
  name: string;
  initials: string;
  role: Role;
}
