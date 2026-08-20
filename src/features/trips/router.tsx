import type { RouteObject } from "react-router-dom";

export const tripsRoutes: RouteObject[] = [
  {
    path: "trips",
    lazy: async () => ({
      Component: (await import("./TripsPage")).default,
    }),
  },
];
