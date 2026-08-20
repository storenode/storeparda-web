import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Receipt, Package, Truck, BarChart3, Settings, LogOut } from "lucide-react";
import { useMember } from "@/features/auth/useMember";
import { signOut } from "@/features/auth/signOut";

const tabs = [
  { to: "/app/bill", label: "Bill", Icon: Receipt },
  { to: "/app/inventory", label: "Stock", Icon: Package },
  { to: "/app/trips", label: "Trips", Icon: Truck },
  { to: "/app/reports", label: "Reports", Icon: BarChart3 },
  { to: "/app/settings", label: "Settings", Icon: Settings },
];

export function AppShell() {
  const { member } = useMember();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="flex h-full min-w-[320px] flex-col bg-bg text-fg">
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          {member?.avatar_url && (
            <img
              src={member.avatar_url}
              alt=""
              className="size-8 shrink-0 rounded-full"
            />
          )}
          <span className="truncate text-sm font-medium text-fg">
            {member ? [member.first_name, member.last_name].filter(Boolean).join(" ") || member.google_email : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg"
        >
          <LogOut size={18} aria-hidden />
        </button>
      </header>
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
