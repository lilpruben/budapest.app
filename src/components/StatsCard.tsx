import React from 'react';
import { Award } from 'lucide-react';
import { Place } from '../types';

interface StatsCardProps {
  places: Place[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ places }) => {
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

  return (
    <div className="mx-4 sm:mx-6 my-2 bg-slate-50/90 rounded-xl p-3 border border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            NIVEL
          </span>
          <span className="text-xs font-bold text-slate-900">{levelTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            PENDIENTES
          </span>
          <span className="text-xs font-mono font-bold text-amber-700">
            {total - visitedCount}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            LOGRADO
          </span>
          <span className="text-xs font-mono font-bold text-emerald-600">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
