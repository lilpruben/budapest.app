import React, { useState } from 'react';
import {
  Search,
  X,
  Clock,
  ArrowDownAZ,
  Star,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Compass,
  Sparkles,
} from 'lucide-react';
import { SortOption, PlacePriority, PlaceCategory } from '../types';

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

interface CategoryOption {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Todas las zonas', icon: '✨', desc: 'Todo Budapest' },
  { id: 'pest', label: 'Pest', icon: '🏛️', desc: 'Parlamento, Basílica y centro' },
  { id: 'buda', label: 'Buda', icon: '🏰', desc: 'Castillo, Bastión y colinas' },
  { id: 'termas', label: 'Termas', icon: '♨️', desc: 'Széchenyi, Gellért y baños' },
  { id: 'ruin-bars', label: 'Ruin Bars', icon: '🍻', desc: 'Szimpla Kert y ocio' },
  { id: 'cultura', label: 'Cultura', icon: '🎨', desc: 'Museos, Ópera y monumentos' },
  { id: 'miradores', label: 'Miradores', icon: '🔭', desc: 'Vistas panorámicas del río' },
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
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Count active non-search filters
  let activeFilterCount = 0;
  if (statusFilter !== 'all') activeFilterCount++;
  if (selectedCategory !== 'all') activeFilterCount++;
  if (priorityFilter !== 'all') activeFilterCount++;
  if (sortBy !== 'recent') activeFilterCount++;

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <>
      {/* Sleek, Non-Intrusive Search & Filter Bar on the Main Screen */}
      <div className="px-4 sm:px-6 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          {/* Elegant Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-places-input"
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar lugar, barrio o monumento..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-transparent focus:border-slate-300 dark:focus:border-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all font-medium shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 transition-colors"
                title="Borrar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dedicated Filter Button */}
          <button
            id="open-filters-modal-btn"
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-95 shadow-2xs ${
              activeFilterCount > 0
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm'
                : 'bg-slate-100/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
            title="Abrir panel de filtros y opciones de orden"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${activeFilterCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
            <span className="font-medium">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] font-mono font-bold bg-emerald-600 text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Active Filter Pills (Shown ONLY when filters are active) */}
        {isFiltered && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar text-xs animate-in fade-in duration-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5">
              Filtros:
            </span>

            {/* Category Tag */}
            {selectedCategory !== 'all' && currentCategoryObj && (
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 hover:bg-emerald-200 shrink-0 transition-colors"
                title="Quitar filtro de categoría"
              >
                <span>{currentCategoryObj.icon} {currentCategoryObj.label}</span>
                <X className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </button>
            )}

            {/* Status Tag */}
            {statusFilter !== 'all' && (
              <button
                type="button"
                onClick={() => onStatusFilterChange('all')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 hover:bg-amber-200 shrink-0 transition-colors"
                title="Quitar filtro de estado"
              >
                <span>{statusFilter === 'pending' ? 'Por visitar' : 'Visitados'}</span>
                <X className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              </button>
            )}

            {/* Priority Tag */}
            {priorityFilter !== 'all' && (
              <button
                type="button"
                onClick={() => onPriorityFilterChange('all')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border border-indigo-300/80 dark:border-indigo-800 hover:bg-indigo-200 shrink-0 transition-colors"
                title="Quitar filtro de prioridad"
              >
                <span>⭐ {priorityFilter === 'imprescindible' ? 'TOP' : priorityFilter}</span>
                <X className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </button>
            )}

            {/* Sort Tag if non-default */}
            {sortBy !== 'recent' && (
              <button
                type="button"
                onClick={() => onSortChange('recent')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 shrink-0 transition-colors"
                title="Volver a orden cronológico"
              >
                <span>{sortBy === 'alpha' ? 'A - Z' : 'Por Prioridad'}</span>
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}

            {/* Search tag */}
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 shrink-0 transition-colors max-w-[140px] truncate"
                title="Borrar texto de búsqueda"
              >
                <span className="truncate">"{search}"</span>
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}

            {/* Clear all action */}
            <button
              id="clear-all-filters-chip-btn"
              type="button"
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline shrink-0 ml-1 px-1 py-0.5"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* FILTER MODAL / DRAWER (Opened via the Filter Button) */}
      {isFilterModalOpen && (
        <div
          id="filters-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            id="filters-modal-card"
            className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Filtros y Preferencias
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ajusta los monumentos y lugares visibles
                  </p>
                </div>
              </div>

              <button
                id="close-filters-modal-btn"
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cerrar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Scrollable filter sections */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Section 1: Estado de Visita */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
                  Estado de visita
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onStatusFilterChange('all')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      statusFilter === 'all'
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Compass className="w-4 h-4 opacity-80" />
                    <span>Todos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStatusFilterChange('pending')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      statusFilter === 'pending'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-4 h-4 opacity-80" />
                    <span>Por visitar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStatusFilterChange('visited')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      statusFilter === 'visited'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-4 h-4 opacity-80 stroke-[3]" />
                    <span>Visitados</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Zonas & Categorías */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
                  Zona o Tipo de Lugar
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = cat.id === 'all' ? totalCount : categoryCounts[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onCategoryChange(cat.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 shadow-xs'
                            : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg leading-none">{cat.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">{cat.label}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {cat.desc}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isSelected
                              ? 'bg-emerald-200/70 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
                              : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Nivel de Prioridad */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
                  Prioridad del Viaje
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onPriorityFilterChange('all')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      priorityFilter === 'all'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Cualquiera
                  </button>

                  <button
                    type="button"
                    onClick={() => onPriorityFilterChange('imprescindible')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1 ${
                      priorityFilter === 'imprescindible'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>TOP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPriorityFilterChange('recomendado')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      priorityFilter === 'recomendado'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Recomendado
                  </button>
                </div>
              </div>

              {/* Section 4: Criterio de Orden */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
                  Ordenar Lista Por
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onSortChange('recent')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      sortBy === 'recent'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    <span>Ruta / Fecha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSortChange('alpha')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      sortBy === 'alpha'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowDownAZ className="w-3.5 h-3.5 opacity-80" />
                    <span>A - Z</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSortChange('priority')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      sortBy === 'priority'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 opacity-80" />
                    <span>Prioridad</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                }}
                disabled={!isFiltered}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>

              <button
                id="apply-filters-btn"
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-98 text-center"
              >
                Ver {filteredCount} {filteredCount === 1 ? 'lugar' : 'lugares'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
