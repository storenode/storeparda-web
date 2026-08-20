import type { RouteObject } from "react-router-dom";

export const reportsRoutes: RouteObject[] = [
  {
    path: "reports",
    lazy: async () => ({
      Component: (await import("./ReportsPage")).default,
    }),
  },
];
