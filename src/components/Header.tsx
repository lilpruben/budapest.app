import React from 'react';
import { Plus, Database, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { DbStatus } from '../types';

interface HeaderProps {
  dbStatus: DbStatus | null;
  totalCount: number;
  visitedCount: number;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAddModal: () => void;
  onOpenServerModal: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dbStatus,
  totalCount,
  visitedCount,
  isDark,
  onToggleDark,
  onOpenAddModal,
  onOpenServerModal,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const percentage = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  // If collapsed, display high-efficiency compact bar
  if (isCollapsed) {
    return (
      <header className="px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors flex items-center justify-between">
        {/* Left: Brand + progress pill + Expand trigger */}
        <button
          id="expand-header-btn"
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-2 group text-left"
          title="Expandir cabecera y progreso"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Budapest.
            </h1>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform" />
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
            {visitedCount}/{totalCount} ({Math.round(percentage)}%)
          </span>
        </button>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            id="open-add-place-btn"
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-xs transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>NUEVO</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="pt-3 sm:pt-4 px-4 sm:px-6 pb-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors">
      {/* Top action row */}
      <div className="flex justify-between items-center mb-2.5">
        {/* DB Status Badge button */}
        <button
          id="open-db-status-btn"
          type="button"
          onClick={onOpenServerModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
            dbStatus?.connected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
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

        {/* Right side controls: Collapse toggle + Dark Mode + New Spot button */}
        <div className="flex items-center gap-1.5">
          {/* Header Collapse button */}
          {onToggleCollapse && (
            <button
              id="collapse-header-btn"
              type="button"
              onClick={onToggleCollapse}
              aria-label="Colapsar cabecera"
              title="Colapsar cabecera para ganar espacio"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-xs"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}

          {/* Dark Mode Toggle button */}
          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-xs"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* New spot button */}
          <button
            id="open-add-place-btn"
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">NUEVO</span>
            <span>SITIO</span>
          </button>
        </div>
      </div>

      {/* Main title & Visited score row */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Budapest.
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Checklist de sitios emblemáticos
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            VISITADOS
          </p>
          <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 leading-none">
            {visitedCount}/{totalCount}
          </p>
        </div>
      </div>

      {/* High density progress bar */}
      <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500 rounded-full"
          style={{ width: `${Math.max(percentage, totalCount > 0 ? 2 : 0)}%` }}
        />
      </div>
    </header>
  );
};
