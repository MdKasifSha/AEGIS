import { Terminal } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function EventLog({ logs }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-32 w-full mt-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col overflow-hidden flex-shrink-0">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2 bg-slate-900/50">
        <Terminal className="h-3.5 w-3.5 text-slate-400" />
        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          Tactical Event Log
        </h3>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1.5 custom-scrollbar"
      >
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`flex items-start gap-2 ${log.type === 'hit' ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            <span className="text-slate-600 shrink-0">[{log.time}]</span>
            <span>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
