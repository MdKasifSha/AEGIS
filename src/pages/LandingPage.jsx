import { useState } from "react";
import heroImage from "../assets/hero.png";

export default function LandingPage({ onContinue, onLogout }) {
  const [showBrief, setShowBrief] = useState(false);

  const features = [
    {
      title: "Mission Control",
      text: "Operational oversight for live EW threat detection and signal analysis.",
    },
    {
      title: "Predictive Sweep",
      text: "Compare deterministic scanning with AI-assisted intercept optimization.",
    },
    {
      title: "Rapid Response",
      text: "Track detections, latency, and alert quality in one operational view.",
    },
  ];

  const stats = [
    { label: "Threat posture", value: "Elevated", tone: "text-emerald-400" },
    { label: "AI advantage", value: "+18.4%", tone: "text-cyan-400" },
    { label: "Synced sensors", value: "98.6%", tone: "text-violet-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-lg font-bold text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.18)]">
              A
            </div>
            <div>
              <div className="text-lg font-semibold tracking-[0.18em] text-emerald-400">
                AEGIS
              </div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-slate-400">
                Scan
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onContinue}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Access Console
            </button>
            <button
              onClick={onLogout}
              className="rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300 transition hover:bg-rose-500/20"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center py-16">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                Electronic warfare operations
              </div>

              <div className="space-y-5">
                <h1 className="max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl">
                  Smarter spectrum awareness,
                  <span className="block text-emerald-400">
                    faster response.
                  </span>
                </h1>

                <p className="max-w-xl text-base leading-7 text-slate-300">
                  AEGIS-Scan provides a live, decision-ready picture of RF
                  activity, helping operators compare scanning strategies,
                  identify emitter behavior, and prioritize response decisions
                  under pressure.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onContinue}
                  className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 shadow-[0_12px_24px_rgba(16,185,129,0.22)]"
                >
                  Launch Dashboard
                </button>
                <button
                  onClick={() => setShowBrief((value) => !value)}
                  className="rounded-lg border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  {showBrief ? "Hide Brief" : "View Capability Brief"}
                </button>
              </div>

              {showBrief && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                    Capability overview
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "Adaptive sweep logic",
                      "AI-assisted intercept optimization",
                      "Operator-grade signal context",
                    ].map((item) => (
                      <div
                        key={item}
                        className="soft-card rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-200 transition hover:border-emerald-500/30"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="soft-card rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)] transition hover:border-emerald-500/20"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </div>
                    <div className={`mt-2 text-xl font-semibold ${stat.tone}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="panel-surface-strong rounded-2xl p-6"
              data-premium="true"
            >
              <div className="mb-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.5)]">
                <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_rgba(15,23,42,0.95)_55%,_rgba(2,6,23,1)_100%)] p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.20),transparent_32%)]" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                        Scope
                      </div>
                      <div className="mt-1 text-xl font-semibold text-white">
                        Operational overview
                      </div>
                    </div>
                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-emerald-300">
                      Live
                    </div>
                  </div>

                  <div className="relative mt-4 h-44 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/60">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(53,96,160,0.10)_100%)]" />
                    <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40" />
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/60" />
                    <img
                      src={heroImage}
                      alt="AEGIS spectrum visualization"
                      className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-screen"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                    Signal integrity
                  </div>
                  <div className="mt-1 text-lg font-semibold text-emerald-400">
                    98.6%
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-300">
                  OK
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="soft-card rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-emerald-500/25"
                  >
                    <div className="text-sm font-semibold text-emerald-400">
                      {feature.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
