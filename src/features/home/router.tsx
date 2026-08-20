import type { RouteObject } from "react-router-dom";

export const homeRoutes: RouteObject[] = [
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./HomePage")).default,
    }),
  },
];
