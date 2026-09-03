import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'pending' | 'visited';
  onStatusFilterChange: (status: 'all' | 'pending' | 'visited') => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
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
}) => {
  return (
    <div className="px-4 sm:px-6 pt-3 pb-2 space-y-2.5 bg-white border-b border-slate-100">
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
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Visited / Pending status pill toggle */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl shrink-0">
          <button
            id="filter-status-all"
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
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
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
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
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            VISITADOS
          </button>
        </div>
      </div>

      {/* Category horizontal scrollable chips matching High Density theme */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1 text-[11px] font-bold rounded-full whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
