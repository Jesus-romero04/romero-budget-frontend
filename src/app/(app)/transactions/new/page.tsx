"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionsAPI, categoriesAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import CategoryIcon from "@/components/CategoryIcon";

interface Category {
  id: number;
  name: string;
  icon: string;
  type: "income" | "expense";
  color: string;
}

export default function NewTransactionPage() {
  const { user } = useAuth();
  const router   = useRouter();

  const [type, setType]               = useState<"expense" | "income">("expense");
  const [categories, setCategories]   = useState<Category[]>([]);
  const [categoryId, setCategoryId]   = useState<number | null>(null);
  const [amount, setAmount]           = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate]               = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = categories.filter(c => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) { setError("Seleccioná una categoría"); return; }
    if (!amount || parseFloat(amount) <= 0) { setError("Ingresá un monto válido"); return; }

    setLoading(true);
    setError("");

    try {
      await transactionsAPI.create({
        category_id: categoryId,
        type,
        amount: parseFloat(amount),
        description,
        date,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Header */}
      <header style={{ background: "#0d1526", borderBottom: "1px solid #1e2d4a" }} className="px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "#1e2d4a" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 className="text-white font-semibold text-sm">Nuevo movimiento</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl p-1" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
            <button
              type="button"
              onClick={() => { setType("expense"); setCategoryId(null); }}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={type === "expense" ? {
                background: "rgba(239,68,68,0.15)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.3)",
              } : { color: "rgba(148,163,184,0.4)" }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                Gasto
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategoryId(null); }}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={type === "income" ? {
                background: "rgba(16,185,129,0.15)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.3)",
              } : { color: "rgba(148,163,184,0.4)" }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                Ingreso
              </div>
            </button>
          </div>

          {/* Monto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "rgba(148,163,184,0.4)" }}>$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="w-full rounded-xl pl-8 pr-4 py-3 text-white text-2xl font-bold placeholder-slate-700 focus:outline-none transition-all"
                style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                  style={categoryId === cat.id ? {
                    background: `${cat.color}15`,
                    border: `1.5px solid ${cat.color}50`,
                  } : {
                    background: "#0d1526",
                    border: "1px solid #1e2d4a",
                  }}
                >
                  <CategoryIcon icon={cat.icon} color={categoryId === cat.id ? cat.color : "#475569"} size={36} />
                  <span className="text-xs text-center leading-tight" style={{ color: categoryId === cat.id ? cat.color : "rgba(148,163,184,0.5)" }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Descripción <span style={{ color: "rgba(148,163,184,0.25)" }}>(opcional)</span></label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ej: Supermercado del lunes"
              className="rounded-xl px-4 py-3 text-white text-sm placeholder-slate-700 focus:outline-none transition-all"
              style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
            />
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Fecha</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all"
              style={{ background: "#0d1526", border: "1px solid #1e2d4a", colorScheme: "dark" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
            />
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, rgb(43 49 101), rgb(4 37 61)", boxShadow: loading ? "none" : "0 0 20px rgba(59,130,246,0.2)" }}
              onMouseEnter={e => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 20px rgba(43,49,101,0.7)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 0 10px rgba(43,49,101,0.4)";
  }}
          >
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Guardando...</>
            ) : "Guardar movimiento"}
          </button>

        </form>
      </main>
    </div>
  );
}
