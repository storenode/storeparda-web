import { NavLink, Outlet } from "react-router-dom";
import { Receipt, Package, Truck, BarChart3, Settings } from "lucide-react";

const tabs = [
  { to: "/app/bill", label: "Bill", Icon: Receipt },
  { to: "/app/inventory", label: "Stock", Icon: Package },
  { to: "/app/trips", label: "Trips", Icon: Truck },
  { to: "/app/reports", label: "Reports", Icon: BarChart3 },
  { to: "/app/settings", label: "Settings", Icon: Settings },
];

export function AppShell() {
  return (
    <div className="flex h-full min-w-[320px] flex-col bg-bg text-fg">
      <main className="flex-1 overflow-y-auto p-3">
        <Outlet />
      </main>
      <nav className="grid grid-cols-5 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${
                isActive ? "text-parda-green-600" : "text-fg-muted"
              }`
            }
          >
            <Icon size={20} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
