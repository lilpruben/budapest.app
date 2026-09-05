import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Check,
  Search,
  Compass,
  Clock,
  Lightbulb,
  Building2,
  Maximize2,
  Layers,
} from 'lucide-react';
import { Place, PlaceCategory } from '../types';

interface MapViewProps {
  places: Place[];
  allPlaces: Place[];
  onToggleVisited: (id: string, current: boolean) => void;
}

const CATEGORY_NAMES: Record<PlaceCategory, string> = {
  buda: 'Buda (Castillo)',
  pest: 'Pest (Centro)',
  termas: 'Termas',
  'ruin-bars': 'Ruin Bars',
  cultura: 'Cultura',
  miradores: 'Miradores',
};

const CATEGORY_COLORS: Record<PlaceCategory, { bg: string; text: string; dot: string }> = {
  buda: { bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-300', dot: 'bg-amber-500' },
  pest: { bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-300', dot: 'bg-blue-500' },
  termas: { bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800', text: 'text-cyan-800 dark:text-cyan-300', dot: 'bg-cyan-500' },
  'ruin-bars': { bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800', text: 'text-purple-800 dark:text-purple-300', dot: 'bg-purple-500' },
  cultura: { bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800', text: 'text-rose-800 dark:text-rose-300', dot: 'bg-rose-500' },
  miradores: { bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

export const MapView: React.FC<MapViewProps> = ({
  places,
  allPlaces,
  onToggleVisited,
}) => {
  const displayPlaces = places.length > 0 ? places : allPlaces;

  // Selected place ID
  const [selectedId, setSelectedId] = useState<string>(() => {
    return displayPlaces[0]?._id || '';
  });

  // Local search filter within the map preview list
  const [mapSearch, setMapSearch] = useState('');
  // Map mode: specific place vs whole city
  const [viewMode, setViewMode] = useState<'place' | 'overview'>('place');

  // Active selected place object
  const selectedPlace = useMemo(() => {
    return displayPlaces.find((p) => p._id === selectedId) || displayPlaces[0] || null;
  }, [displayPlaces, selectedId]);

  // Filtered list for selector
  const filteredPlaces = useMemo(() => {
    if (!mapSearch.trim()) return displayPlaces;
    const q = mapSearch.toLowerCase();
    return displayPlaces.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.originalName.toLowerCase().includes(q) ||
        p.locationName.toLowerCase().includes(q)
    );
  }, [displayPlaces, mapSearch]);

  // Build the Google Maps query and embed URL
  const { embedUrl, externalUrl, directionsUrl, locationQuery } = useMemo(() => {
    if (viewMode === 'overview' || !selectedPlace) {
      const query = 'Budapest, Hungary';
      return {
        locationQuery: query,
        embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
        externalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
      };
    }

    const query = selectedPlace.googleMapsQuery || `${selectedPlace.title}, ${selectedPlace.locationName || 'Budapest, Hungary'}`;
    return {
      locationQuery: query,
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
      externalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
    };
  }, [selectedPlace, viewMode]);

  const categoryStyle = selectedPlace ? CATEGORY_COLORS[selectedPlace.category] : null;

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-7xl mx-auto">
      {/* Header bar of the Google Maps preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <span>Google Maps Preview</span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {displayPlaces.length} sitios
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
              {viewMode === 'overview'
                ? 'Vista general de la ciudad de Budapest'
                : selectedPlace?.title || 'Selecciona un sitio para localizarlo'}
            </p>
          </div>
        </div>

        {/* View toggle buttons & External Google Maps link */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('place')}
            className={`px-2.5 py-1.5 rounded-xl font-medium text-[11px] transition-all flex items-center gap-1 ${
              viewMode === 'place'
                ? 'bg-slate-900 text-white dark:bg-emerald-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Punto actual</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('overview')}
            className={`px-2.5 py-1.5 rounded-xl font-medium text-[11px] transition-all flex items-center gap-1 ${
              viewMode === 'overview'
                ? 'bg-slate-900 text-white dark:bg-emerald-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Budapest General</span>
          </button>

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl font-semibold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all flex items-center gap-1"
            title="Abrir en la web o app de Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Grid: Left side selector & place info, Right side interactive Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Quick search & Places list (4 cols on large screen) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              placeholder="Buscar entre los 40 sitios..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Scrollable list of places */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>LISTA DE LUGARES</span>
              <span>{filteredPlaces.length} disponibles</span>
            </div>

            <div className="max-h-[360px] lg:max-h-[460px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPlaces.map((place) => {
                const isSelected = place._id === selectedPlace?._id;
                const catCol = CATEGORY_COLORS[place.category];

                return (
                  <button
                    key={place._id}
                    type="button"
                    onClick={() => {
                      setSelectedId(place._id);
                      setViewMode('place');
                    }}
                    className={`w-full text-left p-2.5 transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-3 border-emerald-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-3 border-transparent'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        place.visited ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      title={place.visited ? 'Visitado' : 'Pendiente'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isSelected
                              ? 'text-emerald-900 dark:text-emerald-300 font-bold'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {place.title}
                        </span>
                        {place.visited && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {place.originalName || place.locationName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${catCol.bg} ${catCol.text}`}
                        >
                          {CATEGORY_NAMES[place.category]}
                        </span>
                        {place.priority === 'imprescindible' && (
                          <span className="text-[9px] text-rose-500 font-bold font-mono">
                            ★ TOP
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Embed & Selected Place Card (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Google Maps Real Preview Frame */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <iframe
              title={`Google Map - ${locationQuery}`}
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Quick overlay bar on top of map */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs pointer-events-auto flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-xs font-semibold">
                  {viewMode === 'overview' ? 'Budapest, Hungría' : selectedPlace?.title}
                </span>
              </div>

              <div className="flex items-center gap-1 pointer-events-auto">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 px-2 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-200"
                  title="Cómo llegar con Google Maps"
                >
                  <Navigation className="w-3 h-3 text-emerald-500 dark:text-emerald-400 group-hover:text-white" />
                  <span className="hidden sm:inline">Ruta</span>
                </a>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all text-slate-700 dark:text-slate-200"
                  title="Ampliar en Google Maps completo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Selected Place Detail Card */}
          {selectedPlace && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyle?.bg} ${categoryStyle?.text}`}
                    >
                      {CATEGORY_NAMES[selectedPlace.category]}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedPlace.priority === 'imprescindible'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : selectedPlace.priority === 'recomendado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {selectedPlace.priority.toUpperCase()}
                    </span>
                    {selectedPlace.estimatedTimeMinutes && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {selectedPlace.estimatedTimeMinutes} min aprox
                      </span>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {selectedPlace.title}
                  </h4>
                  {selectedPlace.originalName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      {selectedPlace.originalName}
                    </p>
                  )}
                </div>

                {/* Mark as visited toggle button */}
                <button
                  type="button"
                  onClick={() => onToggleVisited(selectedPlace._id, selectedPlace.visited)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedPlace.visited
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${
                      selectedPlace.visited ? 'stroke-[3]' : 'text-slate-400'
                    }`}
                  />
                  <span>{selectedPlace.visited ? 'Visitado ✓' : 'Marcar visitado'}</span>
                </button>
              </div>

              {/* Location and query string */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{selectedPlace.locationName}</span>
              </div>

              {/* Description / Reviews */}
              {selectedPlace.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedPlace.description}
                </p>
              )}

              {/* Practical Tip */}
              {selectedPlace.tip && (
                <div className="flex items-start gap-2 text-xs bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 p-2.5 rounded-xl text-amber-900 dark:text-amber-200">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Consejo: </strong>
                    {selectedPlace.tip}
                  </p>
                </div>
              )}

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Cómo llegar (Ruta)</span>
                </a>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver en Google Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
