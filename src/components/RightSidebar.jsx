import {
  BarChart3,
  Crosshair,
  Clock,
  AlertTriangle,
  Zap,
  Download,
} from "lucide-react";

export default function RightSidebar({
  metrics,
  compareMetrics,
  strategy,
  onDownloadReport,
  onOpenReport,
}) {
  const { pd, avgLatency, falseAlarmRate, totalHits, totalMisses } = metrics;
  const hasData = totalHits + totalMisses > 0;

  const renderCompareBadge = (current, baseline, type = "higher-better") => {
    if (!compareMetrics || !hasData || baseline === 0) return null;
    const diff = current - baseline;
    const percent = Math.abs((diff / baseline) * 100).toFixed(0);

    let isBetter = false;
    if (type === "higher-better") isBetter = diff > 0;
    if (type === "lower-better") isBetter = diff < 0;

    const color = isBetter
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-rose-400 bg-rose-500/10 border-rose-500/20";
    const sign = diff > 0 ? "+" : "-";

    return (
      <span
        className={`ml-2 text-[10px] px-1.5 py-0.5 rounded border ${color} whitespace-nowrap`}
      >
        {sign}
        {percent}% vs Open-Loop
      </span>
    );
  };

  const cards = [
    {
      title: "Probability of Detection (Pd)",
      value: hasData ? `${(pd * 100).toFixed(1)}%` : "—",
      subtitle: hasData
        ? pd > 0.8
          ? "High detection confidence"
          : pd > 0.5
            ? "Moderate detection rate"
            : "Low — increase scan coverage"
        : "Awaiting data",
      icon: Crosshair,
      iconColor: "text-emerald-400",
      accentBorder: "border-l-emerald-500",
      glowBg: "bg-emerald-500/5",
      valueColor: hasData
        ? pd > 0.8
          ? "text-emerald-400"
          : pd > 0.5
            ? "text-amber-400"
            : "text-rose-400"
        : "text-slate-200",
      compare: renderCompareBadge(pd, compareMetrics?.pd, "higher-better"),
    },
    {
      title: "Average Intercept Latency",
      value: hasData ? `${avgLatency.toFixed(2)} ticks` : "—",
      subtitle: hasData
        ? avgLatency < 2
          ? "Excellent response time"
          : avgLatency < 3
            ? "Acceptable latency"
            : "High latency — optimize scan"
        : "Awaiting data",
      icon: Clock,
      iconColor: "text-cyan-400",
      accentBorder: "border-l-cyan-500",
      glowBg: "bg-cyan-500/5",
      valueColor: hasData
        ? avgLatency < 2
          ? "text-cyan-400"
          : avgLatency < 3
            ? "text-amber-400"
            : "text-rose-400"
        : "text-slate-200",
      compare: renderCompareBadge(
        avgLatency,
        compareMetrics?.avgLatency,
        "lower-better",
      ),
    },
    {
      title: "False Alarm Rate",
      value: hasData ? `${(falseAlarmRate * 100).toFixed(2)}%` : "—",
      subtitle: hasData
        ? falseAlarmRate < 0.05
          ? "Within acceptable bounds"
          : falseAlarmRate < 0.1
            ? "Elevated — review thresholds"
            : "Critical — reduce sensitivity"
        : "Awaiting data",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      accentBorder: "border-l-amber-500",
      glowBg: "bg-amber-500/5",
      valueColor: hasData
        ? falseAlarmRate < 0.05
          ? "text-emerald-400"
          : falseAlarmRate < 0.1
            ? "text-amber-400"
            : "text-rose-400"
        : "text-slate-200",
      compare: renderCompareBadge(
        falseAlarmRate,
        compareMetrics?.falseAlarmRate,
        "lower-better",
      ),
    },
    {
      title: "Total Intercepts",
      value: hasData ? totalHits.toLocaleString() : "0",
      subtitle: hasData
        ? `Cumulative detections across all bands`
        : "Awaiting data",
      icon: Zap,
      iconColor: "text-rose-400",
      accentBorder: "border-l-rose-500",
      glowBg: "bg-rose-500/5",
      valueColor: hasData ? "text-slate-200" : "text-slate-200",
      compare: renderCompareBadge(
        totalHits,
        compareMetrics?.totalHits,
        "higher-better",
      ),
    },
  ];

  return (
    <aside className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col min-h-0">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide text-emerald-400 uppercase">
            Analytics Panel
          </h2>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
            Active view
          </div>
          <div className="mt-1 text-xs font-medium text-slate-200">
            {compareMetrics
              ? "AI Smart vs Open-Loop baseline"
              : strategy === "sequential"
                ? "Sequential benchmark"
                : "AI Smart benchmark"}
          </div>
        </div>

        {cards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className={`rounded-xl border border-slate-800 ${metric.accentBorder} border-l-2 ${metric.glowBg} p-4 space-y-2 transition-colors hover:border-slate-700`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-tight w-48 truncate">
                  {metric.title}
                </span>
                <Icon className={`h-4 w-4 ${metric.iconColor} flex-shrink-0`} />
              </div>
              <div className="flex items-baseline">
                <div
                  className={`text-2xl font-bold font-mono ${metric.valueColor}`}
                >
                  {metric.value}
                </div>
                {metric.compare}
              </div>
              <div className="text-[10px] text-slate-500">
                {metric.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={onOpenReport}
          disabled={!hasData}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Benchmark Report
        </button>

        <button
          onClick={onDownloadReport}
          disabled={!hasData}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>
    </aside>
  );
}
