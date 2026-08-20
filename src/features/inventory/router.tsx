import type { RouteObject } from "react-router-dom";

export const inventoryRoutes: RouteObject[] = [
  {
    path: "inventory",
    lazy: async () => ({
      Component: (await import("./InventoryPage")).default,
    }),
  },
];
