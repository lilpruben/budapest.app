import React from 'react';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Place } from '../types';

interface StatsCardProps {
  places: Place[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  places,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const total = places.length;
  const visitedCount = places.filter((p) => p.visited).length;
  const percentage = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

  // Traveler title based on progress
  let levelTitle = 'Recién llegado';
  if (percentage === 100) {
    levelTitle = 'Guía Maestro';
  } else if (percentage >= 70) {
    levelTitle = 'Experto del Danubio';
  } else if (percentage >= 40) {
    levelTitle = 'Explorador';
  } else if (percentage > 0) {
    levelTitle = 'Viajero en marcha';
  }

  // Collapsed view: compact micro-summary
  if (isCollapsed) {
    return (
      <div className="mx-4 sm:mx-6 my-1.5">
        <button
          id="expand-statscard-btn"
          type="button"
          onClick={onToggleCollapse}
          className="w-full bg-slate-50/90 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl px-3 py-1.5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between transition-all group select-none shadow-xs"
        >
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Nivel: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{levelTitle}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              {percentage}%
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 my-2 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors relative">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            NIVEL
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{levelTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-right">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            PENDIENTES
          </span>
          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
            {total - visitedCount}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            LOGRADO
          </span>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {percentage}%
          </span>
        </div>

        {onToggleCollapse && (
          <button
            id="collapse-statscard-btn"
            type="button"
            onClick={onToggleCollapse}
            aria-label="Colapsar estadísticas"
            title="Colapsar panel de estadísticas"
            className="w-6 h-6 ml-0.5 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
