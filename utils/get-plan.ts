import { IPlan } from "@/types/Plans";
import { PLANS } from "@/types/constants";


export default function getPlan(tier: IPlan['PLAN']) {
  const userPlan = PLANS?.find((plan) => plan.PLAN === tier);

  return userPlan;
}
