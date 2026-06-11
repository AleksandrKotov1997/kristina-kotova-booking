export type Role = "master";

export interface CurrentUser {
  id: string;
  name: string;
  initials: string;
  role: Role;
}
