import React from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { PlaceItem } from './PlaceItem';

interface PlaceCategoryGroupProps {
  category: PlaceCategory;
  categoryLabel: string;
  categoryIcon: string;
  places: Place[];
  isCollapsed: boolean;
  onToggleCollapse: (cat: PlaceCategory) => void;
  onToggleVisited: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onUploadPhotos?: (id: string, photos: string[]) => Promise<void>;
  onDeletePhoto?: (id: string, photoIndex: number) => Promise<void>;
  isAdmin?: boolean;
}

export const PlaceCategoryGroup: React.FC<PlaceCategoryGroupProps> = ({
  category,
  categoryLabel,
  categoryIcon,
  places,
  isCollapsed,
  onToggleCollapse,
  onToggleVisited,
  onDelete,
  onSaveNotes,
  onUploadPhotos,
  onDeletePhoto,
  isAdmin = false,
}) => {
  if (places.length === 0) return null;

  const total = places.length;
  const visitedCount = places.filter((p) => p.visited).length;
  const isComplete = total > 0 && visitedCount === total;

  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800">
      {/* Collapsible Category Header */}
      <button
        id={`toggle-category-${category}`}
        type="button"
        onClick={() => onToggleCollapse(category)}
        className={`w-full px-4 sm:px-6 py-2.5 flex items-center justify-between text-left transition-colors select-none ${
          isCollapsed
            ? 'bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            : 'bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none select-none">{categoryIcon}</span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {categoryLabel}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            {total}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Progress pill */}
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono font-bold ${
                isComplete
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {visitedCount}/{total}
            </span>
            {isComplete && (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Chevron icon */}
          <div className="text-slate-400 dark:text-slate-500">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* Category Places List when expanded */}
      {!isCollapsed && (
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
          {places.map((place) => (
            <PlaceItem
              key={place._id}
              place={place}
              onToggleVisited={onToggleVisited}
              onDelete={onDelete}
              onSaveNotes={onSaveNotes}
              onUploadPhotos={onUploadPhotos}
              onDeletePhoto={onDeletePhoto}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
