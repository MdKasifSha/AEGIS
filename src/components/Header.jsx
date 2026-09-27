import {
  Play,
  Square,
  ShieldCheck,
  SplitSquareHorizontal,
  LogOut,
  UserCircle2,
} from "lucide-react";

export default function Header({
  simulationStatus,
  strategy,
  onStrategyChange,
  onStart,
  onPause,
  onReset,
  onLogout,
}) {
  const statusColor = {
    IDLE: "text-yellow-400",
    ACTIVE: "text-emerald-400",
    PAUSED: "text-orange-400",
  }[simulationStatus];

  const statusDotColor = {
    IDLE: "bg-yellow-400",
    ACTIVE: "bg-emerald-400",
    PAUSED: "bg-orange-400",
  }[simulationStatus];

  const primaryAction =
    simulationStatus === "ACTIVE"
      ? {
          label: "Pause",
          onClick: onPause,
          tone: "bg-amber-600 hover:bg-amber-500",
        }
      : {
          label: simulationStatus === "PAUSED" ? "Resume" : "Start",
          onClick: onStart,
          tone: "bg-emerald-600 hover:bg-emerald-500",
        };

  const strategyMeta = {
    sequential: { label: "Open-Loop", detail: "Deterministic sweep" },
    "ai-smart": { label: "AI Smart", detail: "Predictive UCB scan" },
    compare: { label: "Compare", detail: "AI vs open-loop" },
  }[strategy];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Title & Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
            <h1 className="text-lg font-bold tracking-wide text-emerald-400">
              AEGIS-Scan
            </h1>
            <span className="text-slate-500 font-light">|</span>
            <span className="text-sm text-slate-400 tracking-wide">
              Smart EW Spectrum Receiver
            </span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 ml-2">
            <span
              className={`h-2 w-2 rounded-full ${statusDotColor} ${simulationStatus === "ACTIVE" ? "animate-pulse" : ""}`}
            />
            <span
              className={`text-xs font-mono tracking-widest ${statusColor}`}
            >
              SIMULATION: {simulationStatus}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1.5">
            <UserCircle2 className="h-4 w-4 text-emerald-400" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Operator
              </span>
              <span className="text-[10px] font-medium text-slate-200">
                AEGIS-01
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(148,163,184,0.07)]">
            <span className="pulse-soft h-2 w-2 rounded-full bg-emerald-400" />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] uppercase tracking-[0.18em] text-emerald-300/70">
                System
              </span>
              <span className="text-[10px] font-medium text-emerald-300">
                Live sync
              </span>
            </div>
          </div>

          {/* Strategy Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
              <button
                onClick={() => onStrategyChange("sequential")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${strategy === "sequential" ? "bg-slate-800 text-orange-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
              >
                Sequential
              </button>
              <button
                onClick={() => onStrategyChange("ai-smart")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${strategy === "ai-smart" ? "bg-slate-800 text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
              >
                AI Smart
              </button>
              <button
                onClick={() => onStrategyChange("compare")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${strategy === "compare" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
              >
                <SplitSquareHorizontal className="h-3.5 w-3.5" />
                Compare
              </button>
            </div>
            <div className="flex flex-col text-right leading-tight">
              <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                Mode
              </span>
              <span className="text-[10px] font-medium text-slate-200">
                {strategyMeta.label}
              </span>
            </div>
          </div>

          <div className="w-px h-6 bg-slate-700 mx-1"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={primaryAction.onClick}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors shadow-lg ${primaryAction.tone}`}
            >
              {simulationStatus === "ACTIVE" ? (
                <Square className="h-3.5 w-3.5" fill="currentColor" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {primaryAction.label}
            </button>

            {(simulationStatus === "ACTIVE" ||
              simulationStatus === "PAUSED") && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-rose-900/30"
              >
                <Square className="h-3.5 w-3.5" fill="currentColor" />
                Reset
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
