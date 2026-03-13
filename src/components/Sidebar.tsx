"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "@/components/Avatar";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Movimientos",
    path: "/transactions",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: "Nuevo",
    path: "/transactions/new",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  const navigate = (path: string) => {
    router.push(path);
    onClose?.();
  };

  return (
    <aside
      className="h-full flex flex-col"
      style={{ width: 240, background: "#0d1526", borderRight: "1px solid #1e2d4a" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #1e2d4a" }}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="RomeroBudget" className="w-9 h-9 rounded-xl object-cover" style={{ border: "1px solid rgba(59,130,246,0.3)" }} />
          <div>
            <p className="text-white font-bold text-sm">RomeroBudget</p>
            <p className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>Gastos familiares</p>
          </div>
        </div>
        {/* Botón cerrar solo en mobile */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "rgba(148,163,184,0.4)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full"
              style={{
                background: active ? "rgba(59,130,246,0.12)" : "transparent",
                color: active ? "#3b82f6" : "rgba(148,163,184,0.5)",
                border: active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {item.icon(active)}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all" style={{ background: "#111827" }} onClick={() => navigate("/profile")}>
          {user?.avatar && <Avatar avatarData={user.avatar} size={32} />}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: "rgba(148,163,184,0.4)" }}>{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "rgba(148,163,184,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(148,163,184,0.3)"; e.currentTarget.style.background = "transparent"; }}
            title="Cerrar sesión"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}