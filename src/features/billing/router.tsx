import type { RouteObject } from "react-router-dom";

export const billingRoutes: RouteObject[] = [
  {
    path: "bill",
    lazy: async () => ({
      Component: (await import("./BillingPage")).default,
    }),
  },
];
