export type IPlan = {
    PLAN: 'free' | 'pro' | 'premium'|'annual';
    LIMITATIONS: {
        PDF_READS: number;
    };
    PRODUCT_ID?: string;
    PLAN_ID?: string;
  };

  export type CheckOutItems = IPlan & {
    stripeCustomerId: string;
    userEmail: string;
  };

