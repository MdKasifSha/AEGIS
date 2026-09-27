import { useState } from "react";

export default function LoginPage({
  onLogin,
  onRegister,
  authMode,
  setAuthMode,
  authError,
}) {
  const [username, setUsername] = useState("aegis.operator");
  const [password, setPassword] = useState("Secure@2025");
  const isRegisterMode = authMode === "register";

  const submitAction = (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      onRegister(username, password);
      return;
    }
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_22%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.15),transparent_32%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="panel-surface-strong grid w-full max-w-4xl overflow-hidden rounded-2xl lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col justify-between bg-slate-950/80 p-8">
            <div>
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-lg font-bold text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  A
                </div>
                <div>
                  <div className="text-lg font-semibold tracking-[0.18em] text-emerald-400">
                    AEGIS
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-slate-500">
                    Scan
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Mission secure access
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Secure access
                </h1>
                <p className="text-sm leading-6 text-slate-300">
                  Sign in to access live mission monitoring, signal analytics,
                  and operator-grade RF comparison workflows.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.5)]">
                <div className="animate-float-up relative overflow-hidden rounded-2xl border border-slate-700 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.12),_rgba(15,23,42,0.96)_52%,_rgba(2,6,23,1)_100%)] p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),transparent_30%)]" />
                  <div className="relative flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-300">
                    <span>Radar sweep</span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                      LIVE
                    </span>
                  </div>

                  <div className="relative mt-4 h-40 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/70">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />
                    <div className="animate-sweep absolute inset-4 rounded-full border border-cyan-400/30" />
                    <div className="absolute inset-9 rounded-full border border-emerald-400/30" />
                    <div className="animate-drift absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse-glow relative h-24 w-24 rounded-full border border-slate-600/80 bg-slate-950/50 shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(52,211,153,0.18)_0%,rgba(15,23,42,0)_70%)]" />
                        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/40" />
                        <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40" />
                        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                      </div>
                    </div>
                    <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-cyan-400/70 to-transparent" />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
                    <div className="absolute inset-0 bg-[conic-gradient(from_240deg,rgba(52,211,153,0.08),rgba(34,211,238,0.2),rgba(52,211,153,0.08))]" />
                  </div>
                </div>
              </div>

              {[
                "Operator authentication",
                "Mission-safe access controls",
                "Real-time monitoring enabled",
              ].map((item) => (
                <div
                  key={item}
                  className="soft-card flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-300"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center bg-slate-900/90 p-8">
            <div className="w-full max-w-md space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {isRegisterMode ? "Create account" : "Welcome back"}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {isRegisterMode ? "Register Operator" : "Operator Login"}
                </h2>
              </div>

              <form onSubmit={submitAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-700 bg-slate-950 accent-emerald-500"
                    />
                    Keep me signed in
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-cyan-400 hover:text-cyan-300"
                      onClick={() => {
                        setAuthMode(isRegisterMode ? "login" : "register");
                        setUsername("");
                        setPassword("");
                      }}
                    >
                      {isRegisterMode ? "Back to Login" : "Register"}
                    </button>
                    <button
                      type="button"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 shadow-[0_12px_24px_rgba(16,185,129,0.28)]"
                >
                  {isRegisterMode ? "Create Account" : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
