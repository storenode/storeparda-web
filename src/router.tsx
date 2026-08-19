import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/bill" replace /> },
      {
        path: "bill",
        lazy: async () => ({
          Component: (await import("./features/billing/BillingPage")).default,
        }),
      },
      {
        path: "inventory",
        lazy: async () => ({
          Component: (await import("./features/inventory/InventoryPage"))
            .default,
        }),
      },
      {
        path: "trips",
        lazy: async () => ({
          Component: (await import("./features/trips/TripsPage")).default,
        }),
      },
      {
        path: "reports",
        lazy: async () => ({
          Component: (await import("./features/reports/ReportsPage")).default,
        }),
      },
      {
        path: "settings",
        lazy: async () => ({
          Component: (await import("./features/settings/SettingsPage")).default,
        }),
      },
    ],
  },
]);
