import { useMemo } from "react";
import { Activity, Crosshair } from "lucide-react";
import {
  EMITTER_FA,
  EMITTER_SR,
  EMITTER_PS,
  TIME_SLOTS,
} from "../hooks/useEmitterSimulation";

function getCellStyle(value, isCurrentColumn) {
  if (value === 0) {
    return {
      bg: isCurrentColumn ? "bg-slate-800/80" : "bg-slate-900/40",
      border: "border-slate-800/60",
      shadow: "",
    };
  }

  const hasFA = (value & EMITTER_FA) !== 0;
  const hasSR = (value & EMITTER_SR) !== 0;
  const hasPS = (value & EMITTER_PS) !== 0;

  let bg, shadow;

  if (hasPS && hasSR) {
    bg = "bg-violet-400";
    shadow = "shadow-[0_0_12px_rgba(167,139,250,0.8)]";
  } else if (hasPS && hasFA) {
    bg = "bg-fuchsia-400";
    shadow = "shadow-[0_0_12px_rgba(232,121,249,0.7)]";
  } else if (hasSR && hasFA) {
    bg = "bg-teal-400";
    shadow = "shadow-[0_0_12px_rgba(45,212,191,0.7)]";
  } else if (hasPS) {
    bg = "bg-violet-500";
    shadow = "shadow-[0_0_10px_rgba(139,92,246,0.7)]";
  } else if (hasSR) {
    bg = "bg-emerald-500";
    shadow = "shadow-[0_0_10px_rgba(16,185,129,0.7)]";
  } else {
    bg = "bg-cyan-400";
    shadow = "shadow-[0_0_10px_rgba(34,211,238,0.7)]";
  }

  return { bg, border: "border-transparent", shadow };
}

export default function SpectrumHeatmap({
  grid,
  currentTick,
  frequencyBands,
  simulationStatus: _simulationStatus,
  activeBands = [],
  hitMarkers = [],
  strategy,
}) {
  const hasData = grid.length > 0 && currentTick > 0;

  const paddedGrid = useMemo(() => {
    if (grid.length >= TIME_SLOTS) return grid;
    const padding = Array.from({ length: TIME_SLOTS - grid.length }, () =>
      new Array(frequencyBands).fill(0),
    );
    return [...padding, ...grid];
  }, [grid, frequencyBands]);

  const currentColIndex = paddedGrid.length - 1;

  const hitMarkerSet = useMemo(() => {
    const set = new Map();
    for (const marker of hitMarkers) {
      const key = `${marker.colIndex}-${marker.bandIndex}`;
      // In compare mode, if both hit, we just store the first one or an array.
      // A simple map is fine, we just show one reticle.
      set.set(key, marker);
    }
    return set;
  }, [hitMarkers]);

  const bandLabels = useMemo(
    () => Array.from({ length: frequencyBands }, (_, i) => `Band ${i + 1}`),
    [frequencyBands],
  );

  if (!hasData) {
    return (
      <main className="flex-1 p-4 overflow-auto min-h-0">
        <div className="h-full rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-3">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-400 tracking-wide">
              2D RF Spectrum Heatmap (Frequency vs Time)
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                <div className="relative flex items-center justify-center w-full h-full rounded-full bg-slate-800/80 border border-slate-700">
                  <Activity className="h-8 w-8 text-emerald-500/50" />
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Press{" "}
                <span className="text-emerald-400 font-semibold">
                  Start Simulation
                </span>{" "}
                to begin RF scanning
              </p>
              <p className="text-xs text-slate-600">
                The 2D heatmap will render live emitter activity across
                frequency bands and time
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const CELL_H = 20;
  const GAP = 2;
  const gridHeight = frequencyBands * (CELL_H + GAP);

  const getStrategyLabel = () => {
    if (strategy === "sequential") return "Sequential Sweep";
    if (strategy === "ai-smart") return "AI Smart (UCB)";
    return "Compare Mode (Parallel)";
  };

  return (
    <main className="flex-1 px-4 pt-4 overflow-hidden min-h-0 flex flex-col">
      <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col min-h-0 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-400 tracking-wide">
              2D RF Spectrum Heatmap
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>
              Tick:{" "}
              <span className="text-emerald-400 font-mono font-semibold">
                {currentTick}
              </span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              {getStrategyLabel()}
            </span>
            {/* Legend */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                <span>FA</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                <span>SR</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                <span>PS</span>
              </span>
              <span className="flex items-center gap-1">
                <Crosshair className="h-2.5 w-2.5 text-red-500" />
                <span className="text-red-400">HIT</span>
              </span>
            </div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-auto p-3 min-h-0 relative">
          <div className="flex gap-0 relative">
            {/* Y-axis */}
            <div
              className="flex flex-col pr-2 flex-shrink-0 relative z-10"
              style={{ gap: `${GAP}px` }}
            >
              {bandLabels.map((label, i) => {
                const isActive = activeBands.some((b) => b.index === i);
                return (
                  <div
                    key={i}
                    className={`text-[9px] font-mono leading-none flex items-center justify-end transition-colors ${
                      isActive ? "text-slate-200 font-bold" : "text-slate-600"
                    }`}
                    style={{ height: `${CELL_H}px` }}
                  >
                    {isActive && (
                      <span className="mr-1 text-emerald-400">▸</span>
                    )}
                    {label}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-hidden relative">
              <div
                className="grid relative"
                style={{
                  gridTemplateColumns: `repeat(${TIME_SLOTS}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${frequencyBands}, ${CELL_H}px)`,
                  gap: `${GAP}px`,
                }}
              >
                {paddedGrid.map((column, colIdx) => {
                  const isCurrent = colIdx === currentColIndex;
                  return column.map((value, bandIdx) => {
                    const style = getCellStyle(value, isCurrent);

                    const isReceiverRow = activeBands.some(
                      (b) => b.index === bandIdx,
                    );
                    const isReceiverCell = isReceiverRow && isCurrent;

                    const hitKey = `${colIdx}-${bandIdx}`;
                    const hitMarker = hitMarkerSet.get(hitKey);
                    const hasHit = !!hitMarker;

                    return (
                      <div
                        key={`${colIdx}-${bandIdx}`}
                        className={`
                          rounded-[3px] border transition-all duration-150 relative
                          ${style.bg} ${style.border} ${style.shadow}
                          ${isCurrent ? "ring-1 ring-emerald-500/30" : ""}
                          ${isReceiverCell ? "ring-1 ring-slate-200/50" : ""}
                        `}
                        style={{
                          gridColumn: colIdx + 1,
                          gridRow: bandIdx + 1,
                        }}
                      >
                        {hasHit && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <Crosshair
                              className={`h-3.5 w-3.5 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.9)] ${
                                hitMarker.age <= 3
                                  ? "animate-ping"
                                  : "opacity-60"
                              }`}
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                    );
                  });
                })}
              </div>

              {/* Overlays for active receiver bands */}
              {activeBands.map((band, i) => (
                <div
                  key={`overlay-${i}`}
                  className={`absolute left-0 right-0 pointer-events-none border-y-2 ${band.color} ${band.bg} transition-all duration-200 z-10`}
                  style={{
                    top: `${band.index * (CELL_H + GAP)}px`,
                    height: `${CELL_H}px`,
                    opacity: 0.3,
                  }}
                />
              ))}

              {/* Vertical sweep bar */}
              <div
                className="absolute top-0 w-[2px] bg-emerald-400/60 pointer-events-none z-30"
                style={{
                  height: `${gridHeight}px`,
                  left: `${((currentColIndex + 0.5) / TIME_SLOTS) * 100}%`,
                  transform: "translateX(-50%)",
                  boxShadow:
                    "0 0 8px rgba(52, 211, 153, 0.5), 0 0 20px rgba(52, 211, 153, 0.2)",
                }}
              />

              {/* X-axis */}
              <div
                className="grid mt-1"
                style={{
                  gridTemplateColumns: `repeat(${TIME_SLOTS}, minmax(0, 1fr))`,
                }}
              >
                {paddedGrid.map((_, colIdx) => {
                  const tickNumber = currentTick - (TIME_SLOTS - 1 - colIdx);
                  const showLabel = tickNumber > 0 && tickNumber % 5 === 0;
                  return (
                    <div
                      key={colIdx}
                      className="text-center text-[8px] font-mono text-slate-600"
                    >
                      {showLabel ? `t${tickNumber}` : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
