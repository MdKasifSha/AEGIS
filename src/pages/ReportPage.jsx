export default function ReportPage({
  currentTick,
  chartData,
  metricsSeq,
  metricsSmart,
  noiseLevel,
  radcharProfile,
  onBack,
  onDownloadReport,
}) {
  const pct = (value) => `${(value * 100).toFixed(1)}%`;
  const avgLatencySeq = Number(metricsSeq.avgLatency.toFixed(2));
  const avgLatencySmart = Number(metricsSmart.avgLatency.toFixed(2));
  const bestPd = Math.max(metricsSeq.pd, metricsSmart.pd);
  const bestPdLabel =
    metricsSeq.pd >= metricsSmart.pd ? "Sequential" : "AI Smart";
  const summaryLabel =
    noiseLevel <= 0
      ? metricsSeq.totalHits >= metricsSmart.totalHits
        ? "Sequential ahead"
        : "AI ahead"
      : metricsSmart.totalHits >= metricsSeq.totalHits
        ? "AI ahead"
        : "Sequential ahead";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_0_1px_rgba(15,118,110,0.1)]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/70">
              AEGIS Scan
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">
              Benchmark Report
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Back to dashboard
            </button>
            <button
              onClick={onDownloadReport}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500"
            >
              Download report
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-slate-900/80 to-emerald-500/10 p-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-blue-300/80">
            RadChar dataset
          </div>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xl font-semibold text-white">
                {radcharProfile.name}
              </div>
              <div className="mt-1 text-sm text-slate-300">
                {radcharProfile.waveform}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-200">
              <span className="rounded border border-slate-700 bg-slate-900/80 px-2 py-1">
                {radcharProfile.band}
              </span>
              <span className="rounded border border-slate-700 bg-slate-900/80 px-2 py-1">
                Duty {radcharProfile.dutyCycle}
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            {radcharProfile.signature}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Sequential Sweep
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-cyan-300">
              {metricsSeq.totalHits}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Total hits • Pd {pct(metricsSeq.pd)} • Latency {avgLatencySeq}{" "}
              ticks
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              AI Smart Scan
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-emerald-300">
              {metricsSmart.totalHits}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Total hits • Pd {pct(metricsSmart.pd)} • Latency {avgLatencySmart}{" "}
              ticks
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Detection Confidence
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-amber-300">
              {pct(bestPd)}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Best case observed in {bestPdLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Summary
            </div>
            <div className="mt-3 text-xl font-bold text-emerald-300">
              {summaryLabel}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Total intercept spread:{" "}
              {Math.abs(metricsSmart.totalHits - metricsSeq.totalHits)} hits
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Final tick
              </div>
              <div className="mt-1 text-2xl font-bold text-white">
                {currentTick}
              </div>
            </div>
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Sequential vs AI Smart
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-left">
              <thead className="bg-slate-950/80">
                <tr>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Tick
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Sequential
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    AI Smart
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                {chartData.map((point) => (
                  <tr key={point.tick} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-sm text-slate-200">
                      {point.tick}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-cyan-300">
                      {point.Sequential}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-emerald-300">
                      {point.Smart}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
