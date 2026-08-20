import type { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth/callback",
    lazy: async () => ({
      Component: (await import("./AuthCallbackPage")).default,
    }),
  },
];
