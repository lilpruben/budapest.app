import React from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  Clock,
  ArrowDownAZ,
  Star,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SortOption, PlacePriority } from '../types';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'pending' | 'visited';
  onStatusFilterChange: (status: 'all' | 'pending' | 'visited') => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priorityFilter: 'all' | PlacePriority;
  onPriorityFilterChange: (priority: 'all' | PlacePriority) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  filteredCount: number;
  totalCount: number;
  categoryCounts?: Record<string, number>;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'TODOS' },
  { id: 'pest', label: 'PEST' },
  { id: 'buda', label: 'BUDA' },
  { id: 'termas', label: 'TERMAS' },
  { id: 'ruin-bars', label: 'RUIN BARS' },
  { id: 'cultura', label: 'CULTURA' },
  { id: 'miradores', label: 'MIRADORES' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCategory,
  onCategoryChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  isFiltered,
  filteredCount,
  totalCount,
  categoryCounts = {},
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // If collapsed, display compact collapsible summary bar
  if (isCollapsed) {
    return (
      <div className="px-4 sm:px-6 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-between">
        <button
          id="expand-filterbar-btn"
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors select-none group"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Filtros y Búsqueda</span>
          {isFiltered ? (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              {filteredCount}/{totalCount}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
              ({totalCount})
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pt-2 pb-2 space-y-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      {/* Collapsible section title row */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/60">
        <button
          id="collapse-filterbar-btn"
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors select-none group"
          title="Colapsar filtros"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Filtros y Búsqueda</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* Search and Status Segments */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-places-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, barrio o tip..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Visited / Pending status pill toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl shrink-0">
          <button
            id="filter-status-all"
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            TODOS
          </button>
          <button
            id="filter-status-pending"
            type="button"
            onClick={() => onStatusFilterChange('pending')}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
              statusFilter === 'pending'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            PENDIENTES
          </button>
          <button
            id="filter-status-visited"
            type="button"
            onClick={() => onStatusFilterChange('visited')}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
              statusFilter === 'visited'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            VISITADOS
          </button>
        </div>
      </div>

      {/* Category horizontal scrollable chips with counts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' ? totalCount : categoryCounts[cat.id] || 0;
          return (
            <button
              id={`filter-cat-${cat.id}`}
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold shrink-0 transition-all border flex items-center gap-1 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Priority level & Sorting section */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Priority quick filters */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px] font-bold uppercase mr-0.5">
            PRIORIDAD:
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0 gap-0.5">
            <button
              type="button"
              onClick={() => onPriorityFilterChange('all')}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all ${
                priorityFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              TODAS
            </button>
            <button
              type="button"
              onClick={() => onPriorityFilterChange('imprescindible')}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all flex items-center gap-0.5 ${
                priorityFilter === 'imprescindible'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Star className="w-2 h-2 fill-amber-500 text-amber-500" />
              <span>TOP</span>
            </button>
            <button
              type="button"
              onClick={() => onPriorityFilterChange('recomendado')}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all ${
                priorityFilter === 'recomendado'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              RECOMENDADO
            </button>
          </div>
        </div>

        {/* Sort segment */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px] font-bold uppercase mr-0.5">
            ORDEN:
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0 gap-0.5">
            <button
              id="sort-by-recent"
              type="button"
              onClick={() => onSortChange('recent')}
              title="Ordenar por más recientes"
              className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all ${
                sortBy === 'recent'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Clock className="w-2.5 h-2.5" />
              <span>Fecha</span>
            </button>

            <button
              id="sort-by-alpha"
              type="button"
              onClick={() => onSortChange('alpha')}
              title="Ordenar alfabéticamente (A-Z)"
              className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all ${
                sortBy === 'alpha'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <ArrowDownAZ className="w-2.5 h-2.5" />
              <span>A-Z</span>
            </button>

            <button
              id="sort-by-priority"
              type="button"
              onClick={() => onSortChange('priority')}
              title="Ordenar por nivel de prioridad"
              className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all ${
                sortBy === 'priority'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Star className="w-2.5 h-2.5" />
              <span>Prioridad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active filters summary & Quick Reset button */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mostrando {filteredCount} de {totalCount} lugares</span>
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold active:scale-95"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};
