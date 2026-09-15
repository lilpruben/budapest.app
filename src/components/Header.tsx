import React from 'react';
import {
  Plus,
  Database,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Camera,
  Compass,
  Sparkles,
} from 'lucide-react';
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
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onOpenTripRecap: () => void;
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
  isAdmin,
  onOpenAdminModal,
  onOpenTripRecap,
}) => {
  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  // Compact Header view
  if (isCollapsed) {
    return (
      <header className="px-4 sm:px-6 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors flex items-center justify-between shadow-2xs">
        {/* Left: Brand + progress pill + Expand trigger */}
        <button
          id="expand-header-btn"
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-2 group text-left"
          title="Expandir cabecera"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base font-display font-black text-slate-900 dark:text-white tracking-tight">
              Budapest
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform" />
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
            {visitedCount}/{totalCount} ({percentage}%)
          </span>
        </button>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="recap-compact-btn"
            type="button"
            onClick={onOpenTripRecap}
            title="Ver Álbum de Fotos"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-500/25 transition-all active:scale-95"
          >
            <Camera className="w-3 h-3 text-amber-500" />
            <span className="hidden xs:inline">Álbum</span>
          </button>

          {isAdmin && (
            <>
              <button
                id="admin-compact-btn"
                type="button"
                onClick={onOpenAdminModal}
                title="Panel de Administrador"
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>

              <button
                id="server-compact-btn"
                type="button"
                onClick={onOpenServerModal}
                title="Ajustes de Servidor & Base de datos"
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 text-emerald-400 border border-slate-700 hover:bg-slate-800 transition-all"
              >
                <Database className="w-3 h-3" />
              </button>
            </>
          )}

          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            id="open-add-place-btn"
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-2xs transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>NUEVO</span>
          </button>
        </div>
      </header>
    );
  }

  // Expanded Luxury Editorial Header
  return (
    <header className="pt-4 px-4 sm:px-6 pb-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors shadow-2xs">
      {/* Top action row */}
      <div className="flex justify-between items-center mb-3">
        {/* Left Side: Brand badge & Album button */}
        <div className="flex items-center gap-2">
          {/* Álbum & Recap Button */}
          <button
            id="open-trip-recap-btn"
            type="button"
            onClick={onOpenTripRecap}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all active:scale-95 shadow-2xs group"
            title="Ver Álbum de Fotos & Recuerdos del Viaje"
          >
            <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:rotate-6 transition-transform" />
            <span className="tracking-wide">ÁLBUM & RECAP</span>
          </button>

          {/* Admin Controls (Only if logged in) */}
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              <button
                id="open-admin-panel-btn"
                type="button"
                onClick={onOpenAdminModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 transition-all"
                title="Administrador activo: Haz clic para ver opciones"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-[10px] tracking-wide">ADMIN</span>
              </button>

              <button
                id="open-db-status-btn"
                type="button"
                onClick={onOpenServerModal}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  dbStatus?.connected
                    ? 'bg-slate-900 text-emerald-400 border-slate-700 hover:bg-slate-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Consola de Servidor & Base de Datos"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="font-mono text-[10px] font-bold">
                  {dbStatus?.connected ? 'MONGO' : 'LOCAL'}
                </span>
                <Database className="w-3 h-3 opacity-80" />
              </button>
            </div>
          )}
        </div>

        {/* Right side controls: Collapse toggle + Dark Mode + New Spot button */}
        <div className="flex items-center gap-1.5">
          {onToggleCollapse && (
            <button
              id="collapse-header-btn"
              type="button"
              onClick={onToggleCollapse}
              aria-label="Colapsar cabecera"
              title="Colapsar cabecera para ganar espacio"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-2xs"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}

          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-2xs"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="open-add-place-btn"
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NUEVO</span>
          </button>
        </div>
      </div>

      {/* Main Title & Progress Stats */}
      <div className="flex items-end justify-between mb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              Budapest
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              Guía & Checkpoint
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Monumentos, termas y rincones imprescindibles
          </p>
        </div>

        {/* Visited Progress Indicator */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">
              {visitedCount}
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              / {totalCount}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {percentage}% visitados
          </span>
        </div>
      </div>

      {/* Refined Smooth Gradient Progress Bar */}
      <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-500 rounded-full shadow-xs"
          style={{ width: `${Math.max(percentage, totalCount > 0 ? 2 : 0)}%` }}
        />
      </div>
    </header>
  );
};
