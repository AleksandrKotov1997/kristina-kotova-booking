import type { Role, CurrentUser } from "./types";

export const ROLE_LABELS = {
  master: "Master",
} satisfies Record<Role, string>;

export const DEMO_USERS: CurrentUser[] = [
  {
    id: "master-1",
    name: "Kristina Kotova",
    initials: "КК",
    role: "master",
  },
];

export const getDemoUserById = (userId: string): CurrentUser | undefined => {
  const user = DEMO_USERS.find((user) => user.id === userId);
  return user;
};

export const findDemoUserById = (userId: string | undefined): CurrentUser => {
  const user = getDemoUserById(userId ?? "");
  if (!user) {
    return DEMO_USERS[0];
  }
  return user;
};
