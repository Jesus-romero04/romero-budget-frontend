"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import CategoryIcon from "@/components/CategoryIcon";

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
  user_id: number;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());
  const [type, setType]   = useState<"all" | "income" | "expense">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchTransactions();
  }, [user, month, year, type]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: any = { month, year };
      if (type !== "all") params.type = type;
      const res = await transactionsAPI.getAll(params);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este movimiento?")) return;
    try {
      await transactionsAPI.remove(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "No podés eliminar este movimiento");
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const totalIncome  = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Header */}
      <header style={{ background: "#0d1526", borderBottom: "1px solid #1e2d4a" }} className="px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.push("/dashboard")} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: "#1e2d4a" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 className="text-white font-semibold text-sm flex-1">Movimientos familiares</h1>
        <button
          onClick={() => router.push("/transactions/new")}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
          style={{ background: "linear-gradient(135deg, rgb(43 49 101), rgb(4 37 61)" }}
          onMouseEnter={e => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 20px rgba(43,49,101,0.7)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 0 10px rgba(43,49,101,0.4)";
  }}
        >
          + Agregar
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-4">

        {/* Filtro de mes */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="flex-1 text-center text-sm font-semibold text-white">{months[month - 1]} {year}</span>
          <button
            onClick={() => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Totales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#10b981" }}>Ingresos</p>
            <p className="text-lg font-bold text-white">{fmt(totalIncome)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#ef4444" }}>Gastos</p>
            <p className="text-lg font-bold text-white">{fmt(totalExpense)}</p>
          </div>
        </div>

        {/* Filtro tipo */}
        <div className="flex gap-2">
          {(["all", "expense", "income"] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: type === t ? "#1e2d4a" : "#0d1526",
                color: type === t ? "#fff" : "rgba(148,163,184,0.5)",
                border: `1px solid ${type === t ? "#3b82f6" : "#1e2d4a"}`,
              }}
            >
              {t === "all" ? "Todos" : t === "expense" ? "Gastos" : "Ingresos"}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-xs" style={{ color: "rgba(148,163,184,0.3)" }}>No hay movimientos</p>
              <button onClick={() => router.push("/transactions/new")} className="mt-4 text-xs" style={{ color: "#3b82f6" }}>
                Agregar el primero
              </button>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
              <CategoryIcon icon={tx.category_icon} color={tx.category_color} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{tx.description || tx.category_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar avatarData={tx.user_avatar} size={14} />
                    <p className="text-xs" style={{ color: "rgba(148,163,184,0.35)" }}>
                      {tx.user_name} · {new Date(tx.date).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                  </span>
                  {tx.user_id === user?.id && (
                    <button onClick={() => handleDelete(tx.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style={{ background: "#1e2d4a" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#1e2d4a")}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}