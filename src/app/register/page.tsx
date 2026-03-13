"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

const COLORS = [
  "#3b82f6", "#ec4899", "#10b981", "#8b5cf6",
  "#f97316", "#eab308", "#06b6d4", "#ef4444",
];

const ICONS = [
  { id: "user",    svg: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>, extra: <circle cx="12" cy="7" r="4"/> },
  { id: "star",    svg: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
  { id: "heart",   svg: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> },
  { id: "home",    svg: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
  { id: "zap",     svg: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/> },
  { id: "moon",    svg: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/> },
  { id: "sun",     svg: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></> },
  { id: "music",   svg: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></> },
  { id: "rocket",  svg: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></> },
  { id: "diamond", svg: <><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/></> },
  { id: "book",    svg: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
  { id: "flower",  svg: <><circle cx="12" cy="12" r="3"/><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2zM12 18a2 2 0 0 1 2 2c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2z"/></> },
];

function SvgAvatar({ iconId, color, size = 48 }: { iconId: string; color: string; size?: number }) {
  const icon = ICONS.find(i => i.id === iconId) || ICONS[0];
  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: `${color}25`, border: `1.5px solid ${color}40` }}
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {icon.svg}
        {icon.extra}
      </svg>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor]       = useState(COLORS[0]);
  const [iconId, setIconId]     = useState(ICONS[0].id);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const avatarData = JSON.stringify({ iconId, color });
      const res = await authAPI.register({ name, email, password, avatar: avatarData });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #060b18 0%, #0a1628 50%, #060b18 100%)", backgroundImage: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(99,102,241,0.12), transparent)" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="RomeroBudget" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white">RomeroBudget</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>Crear cuenta nueva</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {/* Preview avatar */}
          <div className="flex flex-col items-center gap-2 py-2">
            <SvgAvatar iconId={iconId} color={color} size={64} />
            <p className="text-xs" style={{ color: "rgba(148,163,184,0.35)" }}>Tu avatar</p>
          </div>

          {/* Íconos */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Ícono</label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => setIconId(icon.id)}
                  className="rounded-xl flex items-center justify-center transition-all"
                  style={{
                    width: 44, height: 44,
                    background: iconId === icon.id ? `${color}20` : "#0d1526",
                    border: `1.5px solid ${iconId === icon.id ? color : "#1e2d4a"}`,
                    transform: iconId === icon.id ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconId === icon.id ? color : "#475569"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icon.svg}
                    {icon.extra}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-xl transition-all"
                  style={{
                    background: c,
                    border: color === c ? "2.5px solid white" : "2px solid transparent",
                    transform: color === c ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none transition-all"
              style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none transition-all"
              style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none transition-all"
              style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 mt-1"
            style={{ background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, rgb(43,49,101), rgb(4,37,61)" }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

        </form>

        <p className="text-center text-xs mt-5" style={{ color: "rgba(148,163,184,0.35)" }}>
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Iniciá sesión
          </Link>
        </p>

      </div>
    </div>
  );
}