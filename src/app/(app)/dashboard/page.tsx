"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import CategoryIcon from "@/components/CategoryIcon";
import dynamic from "next/dynamic";
const MonthlyChart = dynamic(() => import("@/components/MonthlyChart"), { ssr: false });

interface Summary {
  income: number;
  expense: number;
  balance: number;
  by_category: { name: string; icon: string; color: string; total: number }[];
  by_member: { name: string; avatar: string; income: number; expense: number }[];
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  user_name: string;
  user_avatar: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year]  = useState(now.getFullYear());
  const [summary, setSummary]           = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [sumRes, txRes] = await Promise.all([
        transactionsAPI.summary(month, year),
        transactionsAPI.getAll({ month, year }),
      ]);
      setSummary(sumRes.data);
      setTransactions(txRes.data.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  const monthName = new Date(year, month - 1).toLocaleString("es-AR", { month: "long", year: "numeric" });
  const balancePositive = (summary?.balance ?? 0) >= 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6" style={{ background: "#0a0f1e" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 lg:mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "rgba(148,163,184,0.4)" }}>Resumen familiar</p>
          <h1 className="text-white font-bold capitalize text-lg lg:text-xl">{monthName}</h1>
        </div>
        <button
          onClick={() => router.push("/transactions/new")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
          style={{ background: "linear-gradient(135deg, rgb(43,49,101), rgb(4,37,61))", boxShadow: "0 0 8px rgba(43,49,101,0.4)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(43,49,101,0.7)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(43,49,101,0.4)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-5">

        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)", border: "1px solid #2a4a7a" }}>
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{ background: "rgba(59,130,246,0.08)" }} />
              <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full" style={{ background: "rgba(6,182,212,0.06)" }} />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.5)" }}>Balance</p>
                <p className={`text-3xl font-bold mb-2 ${balancePositive ? "text-white" : "text-red-400"}`}>{fmt(summary?.balance ?? 0)}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: balancePositive ? "#10b981" : "#ef4444" }} />
                  <p className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>{balancePositive ? "Situación favorable" : "Gastos superan ingresos"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                </div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#10b981" }}>Ingresos</p>
              </div>
              <p className="text-2xl font-bold text-white">{fmt(summary?.income ?? 0)}</p>
            </div>
            <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                </div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#ef4444" }}>Gastos</p>
              </div>
              <p className="text-2xl font-bold text-white">{fmt(summary?.expense ?? 0)}</p>
            </div>
          </div>

          <MonthlyChart />

          {/* Últimos movimientos */}
          <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Últimos movimientos</h2>
              <button onClick={() => router.push("/transactions")} className="text-xs font-medium" style={{ color: "#3b82f6" }}>Ver todos →</button>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-xs" style={{ color: "rgba(148,163,184,0.3)" }}>No hay movimientos este mes</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 py-1">
                    <CategoryIcon icon={tx.category_icon} color={tx.category_color} size={38} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{tx.description || tx.category_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Avatar avatarData={tx.user_avatar} size={14} />
                        <p className="text-xs" style={{ color: "rgba(148,163,184,0.35)" }}>{tx.user_name} · {new Date(tx.date).toLocaleDateString("es-AR")}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="lg:col-span-1 flex flex-col gap-4 lg:gap-5">

          {summary && summary.by_member.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
              <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(148,163,184,0.4)" }}>Por miembro</h2>
              <div className="flex flex-col gap-4">
                {summary.by_member.map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <Avatar avatarData={m.avatar} size={30} />
                      <span className="text-sm text-slate-300 font-medium">{m.name}</span>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold pl-10">
                      <span style={{ color: "#10b981" }}>+{fmt(m.income)}</span>
                      <span style={{ color: "rgba(148,163,184,0.3)" }}>·</span>
                      <span style={{ color: "#ef4444" }}>-{fmt(m.expense)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary && summary.by_category.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
              <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(148,163,184,0.4)" }}>Por categoría</h2>
              <div className="flex flex-col gap-4">
                {summary.by_category.map((cat, i) => {
                  const pct = summary.expense > 0 ? (cat.total / summary.expense) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <CategoryIcon icon={cat.icon} color={cat.color} size={20} />
                          <span className="text-xs text-slate-400">{cat.name}</span>
                        </div>
                        <span className="text-xs text-slate-300 font-medium">{fmt(cat.total)}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1e2d4a" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #3b82f6, #06b6d4)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
