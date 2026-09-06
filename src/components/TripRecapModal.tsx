import React, { useState, useMemo } from 'react';
import {
  X,
  Camera,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Award,
  Sparkles,
  MapPin,
  Clock,
  Printer,
} from 'lucide-react';
import { Place, PlaceCategory } from '../types';

interface TripRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  isAdmin: boolean;
  onOpenCheckpointModal?: (place: Place, isExchanging: boolean) => void;
}

export const TripRecapModal: React.FC<TripRecapModalProps> = ({
  isOpen,
  onClose,
  places,
  isAdmin,
  onOpenCheckpointModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fullscreenPhoto, setFullscreenPhoto] = useState<{
    placeId: string;
    placeTitle: string;
    photoUrl: string;
    date?: string | null;
    notes?: string;
  } | null>(null);

  // Stats calculation
  const totalPlaces = places.length;
  const visitedPlaces = places.filter((p) => p.visited);
  const visitedCount = visitedPlaces.length;
  const completionPercentage = totalPlaces > 0 ? Math.round((visitedCount / totalPlaces) * 100) : 0;

  // Collect all photos from visited places
  const albumItems = useMemo(() => {
    const items: Array<{
      placeId: string;
      placeTitle: string;
      originalName?: string;
      category: PlaceCategory;
      locationName?: string;
      visitedAt?: string | null;
      notes?: string;
      photoUrl: string;
      photoIndex: number;
    }> = [];

    places.forEach((place) => {
      if (Array.isArray(place.photos) && place.photos.length > 0) {
        place.photos.forEach((photoUrl, idx) => {
          items.push({
            placeId: place._id,
            placeTitle: place.title,
            originalName: place.originalName,
            category: place.category,
            locationName: place.locationName,
            visitedAt: place.visitedAt,
            notes: place.notes,
            photoUrl,
            photoIndex: idx,
          });
        });
      }
    });

    return items;
  }, [places]);

  const filteredAlbumItems = useMemo(() => {
    if (selectedCategory === 'all') return albumItems;
    return albumItems.filter((item) => item.category === selectedCategory);
  }, [albumItems, selectedCategory]);

  const categoryStats = useMemo(() => {
    const cats: Record<string, { total: number; visited: number; photos: number }> = {
      buda: { total: 0, visited: 0, photos: 0 },
      pest: { total: 0, visited: 0, photos: 0 },
      termas: { total: 0, visited: 0, photos: 0 },
      'ruin-bars': { total: 0, visited: 0, photos: 0 },
      cultura: { total: 0, visited: 0, photos: 0 },
      miradores: { total: 0, visited: 0, photos: 0 },
    };

    places.forEach((p) => {
      if (cats[p.category]) {
        cats[p.category].total += 1;
        if (p.visited) cats[p.category].visited += 1;
        if (Array.isArray(p.photos)) cats[p.category].photos += p.photos.length;
      }
    });

    return cats;
  }, [places]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportAlbumJson = () => {
    const data = {
      tripTitle: 'Budapest Recap & Travel Album',
      generatedAt: new Date().toISOString(),
      stats: {
        totalPlaces,
        visitedCount,
        completionPercentage,
        totalPhotos: albumItems.length,
      },
      visitedPlaces: visitedPlaces.map((p) => ({
        title: p.title,
        originalName: p.originalName,
        category: p.category,
        location: p.locationName,
        visitedAt: p.visitedAt,
        notes: p.notes,
        photosCount: p.photos?.length || 0,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budapest-viaje-recap-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        id="trip-recap-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Topbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Álbum & Recap del Viaje a Budapest
                </h2>
                {isAdmin && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
                    Admin View
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tus recuerdos, fotos y balance final de la ciudad imperial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="print-recap-btn"
              type="button"
              onClick={handlePrint}
              title="Imprimir o Guardar en PDF"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              id="export-recap-btn"
              type="button"
              onClick={handleExportAlbumJson}
              title="Descargar datos en JSON"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="close-recap-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Trip Completion Hero Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-5 sm:p-6 shadow-lg border border-slate-700">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Resumen del Viaje • Budapest 2026</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {completionPercentage >= 80
                    ? '¡Viaje Legendario Completado!'
                    : completionPercentage >= 50
                    ? '¡Gran Aventura en Budapest!'
                    : 'Recuerdos de Budapest'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                  Has descubierto {visitedCount} de los {totalPlaces} monumentos y rincones mágicos
                  de la capital húngara.
                </p>
              </div>

              {/* Progress Dial / Big Number */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 self-start sm:self-auto">
                <div className="text-center">
                  <p className="text-3xl font-mono font-black text-emerald-400">
                    {completionPercentage}%
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Completado
                  </p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-3xl font-mono font-black text-amber-400">{albumItems.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Fotos
                  </p>
                </div>
              </div>
            </div>

            {/* Progress line */}
            <div className="mt-5 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Categories Grid Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Desglose por Áreas y Experiencias
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { id: 'buda', label: 'Buda', icon: '🏰' },
                { id: 'pest', label: 'Pest', icon: '🏛️' },
                { id: 'termas', label: 'Termas', icon: '♨️' },
                { id: 'ruin-bars', label: 'Ruin Bars', icon: '🍻' },
                { id: 'cultura', label: 'Cultura', icon: '🎭' },
                { id: 'miradores', label: 'Miradores', icon: '🌄' },
              ].map((c) => {
                const stat = categoryStats[c.id] || { total: 0, visited: 0, photos: 0 };
                const pct = stat.total > 0 ? Math.round((stat.visited / stat.total) * 100) : 0;
                return (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-lg">{c.icon}</span>
                      <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {stat.visited}/{stat.total}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {c.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {pct}% • {stat.photos} 📷
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photo Album Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Galería de Fotos del Viaje ({albumItems.length})
                </h4>
              </div>

              {/* Filter Category */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Todas ({albumItems.length})
                </button>
                {['buda', 'pest', 'termas', 'ruin-bars', 'cultura', 'miradores'].map((cat) => {
                  const count = albumItems.filter((i) => i.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                        selectedCategory === cat
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photos Grid */}
            {filteredAlbumItems.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                <Camera className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Aún no hay fotos en este álbum
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  A medida que visites monumentos, puedes subir fotos desde la tarjeta de cada lugar
                  en la lista.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredAlbumItems.map((item, index) => (
                  <div
                    key={`${item.placeId}-${item.photoIndex}-${index}`}
                    onClick={() =>
                      setFullscreenPhoto({
                        placeId: item.placeId,
                        placeTitle: item.placeTitle,
                        photoUrl: item.photoUrl,
                        date: item.visitedAt,
                        notes: item.notes,
                      })
                    }
                    className="group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.placeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                      <p className="text-white text-xs font-bold truncate drop-shadow-xs">
                        {item.placeTitle}
                      </p>
                      {item.locationName && (
                        <p className="text-[10px] text-slate-300 truncate">{item.locationName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visited Places List Summary */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Lugares Visitados ({visitedCount} de {totalPlaces})
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {visitedPlaces.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Ningún monumento marcado como visitado todavía.
                </div>
              ) : (
                visitedPlaces.map((place) => (
                  <div
                    key={place._id}
                    className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {place.title}
                        </span>
                        {place.originalName && (
                          <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                            ({place.originalName})
                          </span>
                        )}
                      </div>
                      {place.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5 truncate">
                          "{place.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {place.photos && place.photos.length > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {place.photos.length} 📷
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                        Visitado
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox */}
      {fullscreenPhoto && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 animate-in fade-in">
          {/* Topbar */}
          <div className="flex justify-between items-center text-white pb-3">
            <div>
              <h3 className="text-base font-bold">{fullscreenPhoto.placeTitle}</h3>
              {fullscreenPhoto.notes && (
                <p className="text-xs text-slate-300 italic">{fullscreenPhoto.notes}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFullscreenPhoto(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered Image */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <img
              src={fullscreenPhoto.photoUrl}
              alt={fullscreenPhoto.placeTitle}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Bottom info & actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-white/10">
            <span className="text-slate-400 text-xs">
              {fullscreenPhoto.date
                ? `Visitado el ${new Date(fullscreenPhoto.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}`
                : 'Recuerdo del viaje'}
            </span>

            {onOpenCheckpointModal && (
              <button
                type="button"
                onClick={() => {
                  const p = places.find((pl) => pl._id === fullscreenPhoto.placeId);
                  if (p) {
                    setFullscreenPhoto(null);
                    onOpenCheckpointModal(p, true);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Intercambiar foto de este sitio</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
