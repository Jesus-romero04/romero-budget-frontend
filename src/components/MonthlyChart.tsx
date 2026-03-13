"use client";

import { useEffect, useState } from "react";
import { transactionsAPI } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface MonthData {
  month: string;
  month_name: string;
  income: number;
  expense: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: "#0d1526", border: "1px solid #1e2d4a", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span style={{ color: "rgba(148,163,184,0.6)" }}>{p.name === "income" ? "Ingresos" : "Gastos"}:</span>
          <span className="font-semibold text-white">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyChart() {
  const [data, setData]       = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionsAPI.monthly()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-5 flex items-center justify-center" style={{ background: "#0d1526", border: "1px solid #1e2d4a", height: 240 }}>
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl p-5 flex flex-col items-center justify-center" style={{ background: "#0d1526", border: "1px solid #1e2d4a", height: 240 }}>
        <p className="text-2xl mb-2">📊</p>
        <p className="text-xs" style={{ color: "rgba(148,163,184,0.3)" }}>Sin datos para mostrar</p>
      </div>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    income:  Number(d.income),
    expense: Number(d.expense),
  }));

  return (
    <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Últimos 6 meses</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#10b981" }} />
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>Ingresos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#ef4444" }} />
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>Gastos</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
          <CartesianGrid vertical={false} stroke="#1e2d4a" strokeDasharray="4 4" />
          <XAxis
            dataKey="month_name"
            tick={{ fill: "rgba(148,163,184,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(148,163,184,0.4)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 8 }} />
          <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
