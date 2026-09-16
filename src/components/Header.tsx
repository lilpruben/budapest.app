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
  Lock,
  Sparkles,
} from 'lucide-react';
import { DbStatus } from '../types';

interface HeaderProps {
  dbStatus: DbStatus | null;
  totalCount: number;
  visitedCount: number;
  photosCount: number;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAddModal: () => void;
  onOpenServerModal: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onOpenTripRecap: () => void;
  isRecapGenerated: boolean;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dbStatus,
  totalCount,
  visitedCount,
  photosCount,
  isDark,
  onToggleDark,
  onOpenAddModal,
  onOpenServerModal,
  isCollapsed = false,
  onToggleCollapse,
  isAdmin,
  onOpenAdminModal,
  onOpenTripRecap,
  isRecapGenerated,
  onReplayIntro,
}) => {
  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  // Compact Header view
  if (isCollapsed) {
    return (
      <header className="px-3 sm:px-5 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors flex items-center justify-between shadow-2xs">
        {/* Left: Brand + progress pill + Expand trigger */}
        <button
          id="expand-header-btn"
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-2 group text-left min-w-0"
          title="Expandir cabecera"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base font-display font-black text-slate-900 dark:text-white tracking-tight">
              Budapest
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              Sany & Rubén
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform shrink-0" />
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 shrink-0">
            {visitedCount}/{totalCount} ({percentage}%)
          </span>
        </button>

        {/* Right action controls with consistent sizes */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Replay intro button */}
          {onReplayIntro && (
            <button
              id="replay-intro-compact-btn"
              type="button"
              onClick={onReplayIntro}
              title="Ver intro animada de Sany & Rubén"
              className="h-8 w-8 rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Collage & Recap button: Only shown to user if admin generated it, or always to admin */}
          {(isRecapGenerated || isAdmin) && (
            <button
              id="recap-compact-btn"
              type="button"
              onClick={onOpenTripRecap}
              title={isRecapGenerated ? 'Ver Collage y Álbum del Viaje' : 'Vista previa de Recap (Admin)'}
              className={`h-8 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shrink-0 ${
                isRecapGenerated
                  ? 'bg-amber-500 text-slate-950 shadow-xs hover:bg-amber-400 animate-pulse'
                  : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Collage</span>
            </button>
          )}

          {/* Admin button: Opens password login or Admin panel */}
          <button
            id="admin-compact-btn"
            type="button"
            onClick={onOpenAdminModal}
            title={isAdmin ? 'Panel de Administrador (Activo)' : 'Acceso de Administrador (Clave 1234)'}
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
              isAdmin
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
          </button>

          {/* Database button (Admin only) */}
          {isAdmin && (
            <button
              id="server-compact-btn"
              type="button"
              onClick={onOpenServerModal}
              title="Ajustes de Servidor & Base de datos"
              className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-900 text-emerald-400 border border-slate-700 hover:bg-slate-800 transition-all shrink-0"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dark mode button */}
          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* New spot button */}
          <button
            id="open-add-place-btn"
            type="button"
            onClick={onOpenAddModal}
            className="h-8 px-2.5 rounded-full text-[11px] font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-2xs transition-all active:scale-95 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Nuevo</span>
          </button>
        </div>
      </header>
    );
  }

  // Expanded Header
  return (
    <header className="pt-3 sm:pt-4 px-3.5 sm:px-6 pb-3 sm:pb-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors shadow-2xs">
      {/* Top action bar: standard height controls without awkward wraps */}
      <div className="flex justify-between items-center mb-2.5 gap-2">
        {/* Left Side: Brand badge or Collage status if unlocked */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* If recap is generated, show prominent Collage button */}
          {isRecapGenerated ? (
            <button
              id="open-trip-recap-btn"
              type="button"
              onClick={onOpenTripRecap}
              className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0 animate-bounce-subtle"
              title="¡El viaje ha finalizado! Toca para ver el Collage de Fotos"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="tracking-tight whitespace-nowrap">Álbum Collage</span>
              {photosCount > 0 && (
                <span className="bg-slate-950 text-amber-400 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                  {photosCount}
                </span>
              )}
            </button>
          ) : isAdmin ? (
            /* Admin can see preview badge */
            <button
              id="admin-preview-recap-btn"
              type="button"
              onClick={onOpenTripRecap}
              className="h-8 px-2 sm:px-2.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100 transition-all flex items-center gap-1 shrink-0"
              title="Previsualizar Álbum (Solo Admin)"
            >
              <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Recap (Admin)</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">Viaje en curso</span>
            </div>
          )}

          {/* Admin mode active badge */}
          {isAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                id="open-admin-panel-btn"
                type="button"
                onClick={onOpenAdminModal}
                className="h-8 px-2 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 transition-all flex items-center gap-1"
                title="Panel de Administrador"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-[10px]">ADMIN</span>
              </button>

              <button
                id="open-db-status-btn"
                type="button"
                onClick={onOpenServerModal}
                className={`h-8 px-2 rounded-full text-[11px] font-medium border transition-all flex items-center gap-1 ${
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
                <Database className="w-3 h-3 opacity-80" />
              </button>
            </div>
          )}
        </div>

        {/* Right side controls: uniform 32-34px buttons for high precision on mobile */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Replay Intro Button */}
          {onReplayIntro && (
            <button
              id="replay-intro-btn"
              type="button"
              onClick={onReplayIntro}
              title="Ver animación de bienvenida (Sany & Rubén)"
              className="h-8 w-8 rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all active:scale-95 shadow-2xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Admin Login button (if not logged in) */}
          {!isAdmin && (
            <button
              id="header-admin-login-btn"
              type="button"
              onClick={onOpenAdminModal}
              aria-label="Acceso de Administrador"
              title="Acceso de Administrador (Clave 1234)"
              className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-2xs shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dark Mode toggle */}
          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-2xs shrink-0"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Collapse toggle */}
          {onToggleCollapse && (
            <button
              id="collapse-header-btn"
              type="button"
              onClick={onToggleCollapse}
              aria-label="Colapsar cabecera"
              title="Colapsar cabecera para ganar espacio"
              className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-2xs shrink-0"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          {/* New Spot button */}
          <button
            id="open-add-place-btn"
            type="button"
            onClick={onOpenAddModal}
            className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Main Title & Progress Stats */}
      <div className="flex items-end justify-between mb-2">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              Budapest
            </h1>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 dark:from-amber-950/60 dark:to-rose-950/60 border border-amber-300/80 dark:border-amber-700/80 text-[11px] font-bold text-amber-800 dark:text-amber-300 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Sany & Rubén</span>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
            Guía de viaje, baños termales y recuerdos • 2026
          </p>
        </div>

        {/* Visited Progress Indicator */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-xl sm:text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">
              {visitedCount}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500">
              / {totalCount}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {percentage}% visitados
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-500 rounded-full shadow-xs"
          style={{ width: `${Math.max(percentage, totalCount > 0 ? 2 : 0)}%` }}
        />
      </div>
    </header>
  );
};
