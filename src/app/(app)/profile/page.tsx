"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";

const ICONS = ["user","star","heart","home","zap","moon","sun","music","rocket","diamond","book","flower"];
const COLORS = ["#3b82f6","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#f97316"];

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const parseAvatar = () => {
    try { return JSON.parse(user?.avatar || "{}"); } catch { return { iconId: "user", color: "#3b82f6" }; }
  };

  const parsed = parseAvatar();
  const [name, setName]               = useState(user?.name || "");
  const [iconId, setIconId]           = useState(parsed.iconId || "user");
  const [color, setColor]             = useState(parsed.color || "#3b82f6");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");

  const avatarData = JSON.stringify({ iconId, color });

  const handleSave = async () => {
    setError(""); setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden"); return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("La contraseña nueva debe tener al menos 6 caracteres"); return;
    }

    setLoading(true);
    try {
      const payload: any = { name, avatar: avatarData };
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authAPI.updateProfile(payload);
      setUser(res.data.user);
      setSuccess("Perfil actualizado correctamente");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6" style={{ background: "#0a0f1e" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/dashboard")} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Configuración</p>
          <h1 className="text-white font-bold text-lg">Mi perfil</h1>
        </div>
      </div>

      <div className="max-w-2xl flex flex-col gap-5">

        {/* Preview avatar */}
        <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
          <Avatar avatarData={avatarData} size={64} />
          <div>
            <p className="text-white font-semibold text-lg">{name || user?.name}</p>
            <p className="text-sm" style={{ color: "rgba(148,163,184,0.4)" }}>{user?.email}</p>
          </div>
        </div>

        {/* Nombre */}
        <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
          <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(148,163,184,0.4)" }}>Información personal</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all"
              style={{ background: "#111827", border: "1px solid #1e2d4a" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
            />
          </div>
        </div>

        {/* Avatar */}
        <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
          <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(148,163,184,0.4)" }}>Avatar</h2>

          {/* Íconos */}
          <p className="text-xs mb-3" style={{ color: "rgba(148,163,184,0.4)" }}>Ícono</p>
          <div className="grid grid-cols-6 gap-2 mb-5">
            {ICONS.map(id => (
              <button
                key={id}
                onClick={() => setIconId(id)}
                className="aspect-square rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: iconId === id ? `${color}20` : "#111827",
                  border: `1.5px solid ${iconId === id ? color : "#1e2d4a"}`,
                }}
              >
                <Avatar avatarData={JSON.stringify({ iconId: id, color: iconId === id ? color : "#475569" })} size={32} />
              </button>
            ))}
          </div>

          {/* Colores */}
          <p className="text-xs mb-3" style={{ color: "rgba(148,163,184,0.4)" }}>Color</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-xl transition-all"
                style={{
                  background: c,
                  border: color === c ? `2.5px solid white` : "2.5px solid transparent",
                  transform: color === c ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Contraseña */}
        <div className="rounded-2xl p-5" style={{ background: "#0d1526", border: "1px solid #1e2d4a" }}>
          <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(148,163,184,0.4)" }}>Cambiar contraseña</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Contraseña actual", value: currentPassword, set: setCurrentPassword },
              { label: "Nueva contraseña", value: newPassword, set: setNewPassword },
              { label: "Confirmar nueva contraseña", value: confirmPassword, set: setConfirmPassword },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.4)" }}>{label}</label>
                <input
                  type="password"
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl px-4 py-3 text-white text-sm placeholder-slate-700 focus:outline-none transition-all"
                  style={{ background: "#111827", border: "1px solid #1e2d4a" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1e2d4a")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="text-sm px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-white font-semibold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
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
          ) : "Guardar cambios"}
        </button>

      </div>
    </div>
  );
}
