import type { MasterBenefit } from "./types";

export const masterBenefits: Pick<MasterBenefit, "id" | "icon">[] = [
  {
    id: "individual-approach",
    icon: "🎯",
  },
  {
    id: "hygiene",
    icon: "🧴",
  },
  {
    id: "attention-to-detail",
    icon: "✨",
  },
  {
    id: "comfort",
    icon: "🛋️",
  },
  {
    id: "professional-development",
    icon: "📚",
  },
  {
    id: "consultation",
    icon: "💬",
  },
];
