import React from 'react';
import { Compass, RefreshCw, Plus } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
  onResetSeed: () => void;
  onOpenAddModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onClearFilters,
  onResetSeed,
  onOpenAddModal,
}) => {
  return (
    <div className="py-12 px-6 text-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 space-y-3 transition-colors">
      <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
        <Compass className="w-5 h-5" />
      </div>

      <div className="max-w-xs mx-auto">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isFiltered ? 'No se encontraron lugares' : 'Tu checklist está vacío'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isFiltered
            ? 'Prueba a cambiar los filtros o la búsqueda para encontrar puntos emblemáticos.'
            : 'Puedes restaurar la semilla inicial de Budapest o añadir nuevos puntos a conocer.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {isFiltered ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Limpiar filtros
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onResetSeed}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restaurar semilla Budapest
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir punto
            </button>
          </>
        )}
      </div>
    </div>
  );
};
