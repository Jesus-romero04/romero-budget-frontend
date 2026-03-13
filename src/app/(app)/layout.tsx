"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 240 }}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenido */}
      <main className="flex-1 overflow-auto lg:ml-60">
        {/* Header mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 sticky top-0 z-20" style={{ background: "#0d1526", borderBottom: "1px solid #1e2d4a" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#1e2d4a" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <img src="/logo.png" alt="RomeroBudget" className="w-7 h-7 rounded-lg object-cover" />
          <span className="text-white font-bold text-sm">RomeroBudget</span>
        </div>

        {children}
      </main>
    </div>
  );
}

