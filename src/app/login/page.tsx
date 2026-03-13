"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {

  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #060b18 0%, #0a1628 50%, #060b18 100%)", backgroundImage: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(99,102,241,0.12), transparent)" }}>
        
      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6 }}
        className="relative w-full max-w-sm"
      >

        {/* logo */}
        <div className="text-center mb-10">

          <motion.img
            src="/logo.png"
            alt="RomeroBudget"
            className="w-20 h-20 mx-auto rounded-2xl border border-[#1e2d4a]"
            whileHover={{ scale:1.05 }}
            transition={{ type:"spring", stiffness:200 }}
          />

          <h1 className="text-2xl font-bold text-white mt-4">
            RomeroBudget
          </h1>

          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            Control de gastos familiar
          </p>

        </div>


        {/* card */}

        <div className="rounded-2xl p-6 bg-[#0d1526] border border-[#1e2d4a] backdrop-blur-sm">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <motion.div
                initial={{ opacity:0, y:-10 }}
                animate={{ opacity:1, y:0 }}
                className="text-sm px-4 py-3 rounded-xl"
                style={{
                  background:"rgba(239,68,68,0.08)",
                  border:"1px solid rgba(239,68,68,0.2)",
                  color:"#ef4444"
                }}
              >
                {error}
              </motion.div>
            )}

            {/* email */}

            <div className="flex flex-col gap-1">

              <label className="text-xs uppercase tracking-widest text-slate-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="rounded-xl px-4 py-3 text-sm bg-[#111827] border border-[#1e2d4a] text-white focus:border-blue-500 transition-all outline-none"
              />

            </div>


            {/* password */}

            <div className="flex flex-col gap-1">

              <label className="text-xs uppercase tracking-widest text-slate-400">
                Contraseña
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="rounded-xl px-4 py-3 w-full text-sm bg-[#111827] border border-[#1e2d4a] text-white focus:border-blue-500 transition-all outline-none"
                />

                <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  👁
                </button>

              </div>

            </div>


            {/* button */}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale:1.03 }}
              whileTap={{ scale:0.96 }}
              className="text-white font-semibold py-3 rounded-xl text-sm mt-2 flex items-center justify-center gap-2"
              style={{
                background:"linear-gradient(135deg,rgb(43,49,101), rgb(4,37,61)"
              }}
            >

              {loading ? (
                <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                Ingresando...
                </>
              ):(
                "Ingresar"
              )}

            </motion.button>

          </form>

        </div>


        <p className="text-center text-xs mt-6 text-slate-400">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            Registrate
          </Link>
        </p>

      </motion.div>

    </div>
  );
}