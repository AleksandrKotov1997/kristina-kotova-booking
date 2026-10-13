export interface MasterBenefit {
  id:
    | "individual-approach"
    | "hygiene"
    | "attention-to-detail"
    | "comfort"
    | "professional-development"
    | "consultation";
  icon: string;
  title: string;
  description: string;
}
