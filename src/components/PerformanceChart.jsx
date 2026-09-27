import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity } from 'lucide-react';

export default function PerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 w-full mt-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col p-4 justify-center items-center">
         <Activity className="h-6 w-6 text-slate-600 mb-2" />
         <span className="text-xs text-slate-500">Awaiting simulation data for chart...</span>
      </div>
    );
  }

  return (
    <div className="h-56 w-full mt-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col pt-3 pb-1 px-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
          Cumulative Intercept Comparison Over Time
        </h3>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="tick" 
              stroke="#64748b" 
              fontSize={10} 
              tickMargin={6}
              tickFormatter={(val) => `t${val}`}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px', color: '#cbd5e1' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
            <Line 
              type="monotone" 
              dataKey="Sequential" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="Smart" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
