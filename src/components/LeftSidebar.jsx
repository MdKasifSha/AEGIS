import {
  Settings2,
  Radio,
  Radar,
  ScanLine,
  Gauge,
  Volume2,
  Zap,
  Target,
  Database,
} from "lucide-react";

import {
  radcharProfiles,
  radcharSource,
  referenceDatasets,
} from "../data/radcharProfiles";

export default function LeftSidebar({
  emitters,
  onEmittersChange,
  frequencyBands,
  onFrequencyBandsChange,
  noiseLevel,
  onNoiseLevelChange,
  simSpeed,
  onSimSpeedChange,
  onSelectScenario,
  radcharProfile,
}) {
  const toggleEmitter = (key) => {
    onEmittersChange((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const speedOptions = [1, 2, 5];

  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-800 bg-slate-950 overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* Panel Title */}
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide text-emerald-400 uppercase">
            Configuration Panel
          </h2>
        </div>

        {/* Preset Scenarios */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preset Scenarios
            </h3>
          </div>

          <button
            onClick={() => onSelectScenario(1)}
            className="w-full text-left text-[11px] px-3 py-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 transition-colors text-slate-300"
          >
            <span className="text-cyan-400 font-semibold block mb-0.5">
              Scenario 1
            </span>
            High Frequency-Hopping Threat
          </button>

          <button
            onClick={() => onSelectScenario(2)}
            className="w-full text-left text-[11px] px-3 py-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/50 transition-colors text-slate-300"
          >
            <span className="text-emerald-400 font-semibold block mb-0.5">
              Scenario 2
            </span>
            Periodic Rotating Mainbeam Radar
          </button>

          <button
            onClick={() => onSelectScenario(3)}
            className="w-full text-left text-[11px] px-3 py-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-violet-500/50 transition-colors text-slate-300"
          >
            <span className="text-violet-400 font-semibold block mb-0.5">
              Scenario 3
            </span>
            Dense Multi-Emitter Environment
          </button>
        </div>

        {/* Emitter Selection */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Emitter Selection
          </h3>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={emitters.frequencyAgile}
              onChange={() => toggleEmitter("frequencyAgile")}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-slate-900 accent-emerald-500"
            />
            <Radio className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-300 group-hover:text-emerald-300 transition-colors">
              Frequency Agile (Hopping)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={emitters.spatiallyRotating}
              onChange={() => toggleEmitter("spatiallyRotating")}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-slate-900 accent-emerald-500"
            />
            <Radar className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-300 group-hover:text-emerald-300 transition-colors">
              Spatially Rotating Radar
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={emitters.periodicScan}
              onChange={() => toggleEmitter("periodicScan")}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-slate-900 accent-emerald-500"
            />
            <ScanLine className="h-4 w-4 text-rose-400" />
            <span className="text-sm text-slate-300 group-hover:text-emerald-300 transition-colors">
              Periodic Scan Receiver
            </span>
          </label>
        </div>

        {/* Environment Sliders */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Environment Parameters
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400">Frequency Bands</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-slate-800 px-2 py-0.5 rounded">
                {frequencyBands}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              value={frequencyBands}
              onChange={(e) => onFrequencyBandsChange(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700 accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>10</span>
              <span>30</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-slate-400">
                  Signal Noise Level
                </span>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                {noiseLevel}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={noiseLevel}
              onChange={(e) => onNoiseLevelChange(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700 accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs text-slate-400">Simulation Speed</span>
            </div>
            <div className="flex gap-2">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSimSpeedChange(speed)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    simSpeed === speed
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RadChar Profile */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Benchmark Datasets
            </h3>
          </div>

          <div className="rounded border border-slate-800 bg-slate-950 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-blue-300">
              {radcharSource.title}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-100">
              {radcharProfile.name}
            </div>
            <div className="mt-2 text-[10px] text-slate-400 leading-relaxed">
              {radcharProfile.signature}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-300">
              <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1">
                {radcharProfile.band}
              </span>
              <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1">
                Duty {radcharProfile.dutyCycle}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {radcharProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() =>
                  onSelectScenario(
                    profile.id === "frequency-agile"
                      ? 1
                      : profile.id === "rotating-mainbeam"
                        ? 2
                        : 3,
                  )
                }
                className={`w-full rounded border px-2.5 py-2 text-left transition ${
                  radcharProfile.id === profile.id
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  {profile.band}
                </div>
                <div className="mt-1 text-xs font-semibold">{profile.name}</div>
              </button>
            ))}
          </div>

          <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
            <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Reference library
            </div>
            <div className="space-y-2">
              {referenceDatasets.map((dataset) => (
                <a
                  key={dataset.id}
                  href={dataset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded border border-slate-700 bg-slate-900/80 p-2 text-left transition hover:border-blue-500/40 hover:bg-slate-800"
                >
                  <div className="text-[9px] uppercase tracking-[0.14em] text-blue-300">
                    {dataset.provider}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-slate-100">
                    {dataset.name}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {dataset.focus}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <a
            href={radcharSource.url}
            target="_blank"
            rel="noreferrer"
            className="block text-[10px] text-slate-400 underline decoration-slate-600 underline-offset-2 hover:text-blue-400"
          >
            {radcharSource.subtitle}
          </a>
        </div>
      </div>
    </aside>
  );
}
