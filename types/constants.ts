import { IPlan } from "./Plans";


export const PLANS: IPlan[] = [
  {
    PLAN: "free",
    LIMITATIONS: {
      PDF_READS: 3,
    },
  },
  {
    PLAN: "pro",
    PRODUCT_ID: process.env.PRO_PROD_ID,
    PLAN_ID: process.env.PRO_PRICE_ID,
    LIMITATIONS: {
        PDF_READS: 100,
    },
  },
  {
    PLAN: "premium",
    PRODUCT_ID: process.env.PREMIUM_PROD_ID,
    PLAN_ID: process.env.PREMIUM_PRICE_ID,
    LIMITATIONS: {
        PDF_READS: 500,
    },
  },
  {
    PLAN: "annual",
    PRODUCT_ID: process.env.ANNUAL_PROD_ID,
    PLAN_ID: process.env.ANNUAL_PRICE_ID,
    LIMITATIONS: {
        PDF_READS: 700,
    },
  },
];