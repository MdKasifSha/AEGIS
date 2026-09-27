import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import SpectrumHeatmap from "../components/SpectrumHeatmap";
import RightSidebar from "../components/RightSidebar";
import PerformanceChart from "../components/PerformanceChart";
import EventLog from "../components/EventLog";

export default function DashboardPage({
  simulationStatus,
  strategy,
  emitters,
  frequencyBands,
  noiseLevel,
  simSpeed,
  grid,
  currentTick,
  chartData,
  eventLogs,
  onStrategyChange,
  onStart,
  onPause,
  onReset,
  onEmittersChange,
  onFrequencyBandsChange,
  onNoiseLevelChange,
  onSimSpeedChange,
  onSelectScenario,
  onDownloadReport,
  onOpenReport,
  radcharProfile,
  activeMetrics,
  activeBands,
  activeHitMarkers,
  compareMetrics,
  onLogout,
}) {
  return (
    <div className="relative min-h-screen h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="relative z-10 flex flex-col h-full">
        <Header
          simulationStatus={simulationStatus}
          strategy={strategy}
          onStrategyChange={onStrategyChange}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          onLogout={onLogout}
        />

        <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 shadow-[0_0_0_1px_rgba(15,118,110,0.15)]">
            <div className="flex items-center gap-3">
              <span className="pulse-soft h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              <span className="text-[10px] uppercase tracking-[0.26em] text-slate-400">
                Mission board
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="status-chip rounded-full px-2 py-1 text-emerald-300">
                Comms nominal
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/50 px-2 py-1 text-slate-300">
                Noise floor: {noiseLevel}%
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/50 px-2 py-1 text-slate-300">
                Band focus: {frequencyBands}
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Threat posture",
                value: "Elevated",
                tone: "text-emerald-300",
              },
              { label: "AI advantage", value: "+18.4%", tone: "text-cyan-300" },
              { label: "Sensor sync", value: "98.6%", tone: "text-violet-300" },
            ].map((item) => (
              <div
                key={item.label}
                className="soft-card rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)] transition hover:border-emerald-500/20"
              >
                <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </div>
                <div className={`mt-1 text-sm font-semibold ${item.tone}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <LeftSidebar
            emitters={emitters}
            onEmittersChange={onEmittersChange}
            frequencyBands={frequencyBands}
            onFrequencyBandsChange={onFrequencyBandsChange}
            noiseLevel={noiseLevel}
            onNoiseLevelChange={onNoiseLevelChange}
            simSpeed={simSpeed}
            onSimSpeedChange={onSimSpeedChange}
            onSelectScenario={onSelectScenario}
            radcharProfile={radcharProfile}
          />

          <div className="flex-1 flex flex-col min-w-0 p-4 pb-0 h-full">
            <SpectrumHeatmap
              grid={grid}
              currentTick={currentTick}
              frequencyBands={frequencyBands}
              simulationStatus={simulationStatus}
              activeBands={activeBands}
              hitMarkers={activeHitMarkers}
              strategy={strategy}
            />
            <PerformanceChart data={chartData} />
            <EventLog logs={eventLogs} />
          </div>

          <RightSidebar
            metrics={activeMetrics}
            compareMetrics={compareMetrics}
            strategy={strategy}
            onDownloadReport={onDownloadReport}
            onOpenReport={onOpenReport}
          />
        </div>
      </div>
    </div>
  );
}
