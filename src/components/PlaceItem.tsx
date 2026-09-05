import React, { useState } from 'react';
import {
  Check,
  MapPin,
  Clock,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileEdit,
  Save,
} from 'lucide-react';
import { Place } from '../types';

interface PlaceItemProps {
  place: Place;
  onToggleVisited: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
}

export const PlaceItem: React.FC<PlaceItemProps> = ({
  place,
  onToggleVisited,
  onDelete,
  onSaveNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(place.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onSaveNotes(place._id, notes);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const mapsQuery = place.googleMapsQuery || `${place.title} Budapest`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery
  )}`;

  return (
    <article
      id={`place-card-${place._id}`}
      className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
    >
      {/* High Density Row */}
      <div className="flex items-center gap-3.5 px-4 sm:px-6 py-3.5">
        {/* Toggle Checkbox matching High Density Theme */}
        <button
          id={`toggle-place-${place._id}`}
          type="button"
          onClick={() => onToggleVisited(place._id, place.visited)}
          aria-label={`Marcar ${place.title} como ${place.visited ? 'no visitado' : 'visitado'}`}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all active:scale-95 ${
            place.visited
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          {place.visited ? (
            <div className="w-5 h-5 rounded-md bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 text-white dark:text-slate-950 stroke-[3.5]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500" />
          )}
        </button>

        {/* Title, Subtitle, and District */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 min-w-0 cursor-pointer select-none"
        >
          <div className="flex items-center gap-1.5">
            <h3
              className={`text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-snug ${
                place.visited ? 'text-slate-400 dark:text-slate-500 line-through' : ''
              }`}
            >
              {place.title}
            </h3>
            {place.originalName && (
              <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500 italic truncate">
                ({place.originalName})
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {place.locationName || `${place.category.toUpperCase()} • Budapest`}
          </p>
        </div>

        {/* Right Status Pill & Expand Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              place.visited
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
            }`}
          >
            {place.visited ? 'Visited' : 'Pending'}
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Details Tray */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 pt-1 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
          {/* Hungarian Name on mobile if present */}
          {place.originalName && (
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nombre en húngaro:{' '}
              <span className="italic font-normal text-slate-500 dark:text-slate-400">
                {place.originalName}
              </span>
            </p>
          )}

          {/* Full description */}
          {place.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              {place.description}
            </p>
          )}

          {/* Traveler Tip */}
          {place.tip && (
            <div className="flex items-start gap-2 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 rounded-xl p-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-amber-900 dark:text-amber-200">
                  Consejo de viajero:
                </strong>
                <span>{place.tip}</span>
              </div>
            </div>
          )}

          {/* Meta specs: Location, time */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {place.locationName && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{place.locationName}</span>
              </div>
            )}
            {place.estimatedTimeMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>~{place.estimatedTimeMinutes} min</span>
              </div>
            )}
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-semibold uppercase">
              {place.priority}
            </span>
          </div>

          {/* Personal Notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <FileEdit className="w-3 h-3 text-slate-400" />
              Notas personales / Experiencia:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Fuimos a las 18:00, espectacular iluminación..."
                className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes || notes === (place.notes || '')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center gap-1 transition-all"
              >
                <Save className="w-3 h-3" />
                <span>{isSavingNotes ? '...' : 'Guardar'}</span>
              </button>
            </div>
          </div>

          {/* Action links */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver en Google Maps</span>
            </a>

            <div>
              {isConfirmingDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">¿Eliminar?</span>
                  <button
                    type="button"
                    onClick={() => onDelete(place._id)}
                    className="text-xs font-bold px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs p-1 flex items-center gap-1 transition-colors"
                  title="Eliminar este lugar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
