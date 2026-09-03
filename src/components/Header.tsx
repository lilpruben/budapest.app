import React from 'react';
import { Plus, Database, Sparkles } from 'lucide-react';
import { DbStatus } from '../types';

interface HeaderProps {
  dbStatus: DbStatus | null;
  totalCount: number;
  visitedCount: number;
  onOpenAddModal: () => void;
  onOpenServerModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dbStatus,
  totalCount,
  visitedCount,
  onOpenAddModal,
  onOpenServerModal,
}) => {
  const percentage = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  return (
    <header className="pt-4 sm:pt-6 px-4 sm:px-6 pb-3 bg-white border-b border-slate-100 shrink-0">
      {/* Top action row */}
      <div className="flex justify-between items-center mb-3">
        {/* DB Status Badge button */}
        <button
          id="open-db-status-btn"
          type="button"
          onClick={onOpenServerModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
            dbStatus?.connected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title="Estado de conexión a Base de Datos y Servidor"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="font-mono text-[10px] font-bold">
            {dbStatus?.connected ? 'MONGO ACTIVE' : 'LOCAL SEED'}
          </span>
          <Database className="w-3 h-3 opacity-60 ml-0.5" />
        </button>

        {/* New spot button */}
        <button
          id="open-add-place-btn"
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NUEVO SITIO</span>
        </button>
      </div>

      {/* Main title & Visited score row */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
            Budapest.
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Checklist de sitios emblemáticos
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            VISITADOS
          </p>
          <p className="text-xl font-mono font-bold text-[#10b981] leading-none">
            {visitedCount}/{totalCount}
          </p>
        </div>
      </div>

      {/* High density progress bar */}
      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#10b981] transition-all duration-500 rounded-full"
          style={{ width: `${Math.max(percentage, totalCount > 0 ? 2 : 0)}%` }}
        />
      </div>
    </header>
  );
};
