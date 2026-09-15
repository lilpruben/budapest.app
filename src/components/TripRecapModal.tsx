import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Compass,
  Layers,
  Lock,
  Eye,
} from 'lucide-react';
import { Place, PlaceCategory } from '../types';

interface TripRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  isAdmin: boolean;
  isRecapGenerated: boolean;
  onOpenCheckpointModal?: (place: Place, isExchanging: boolean) => void;
}

export const TripRecapModal: React.FC<TripRecapModalProps> = ({
  isOpen,
  onClose,
  places,
  isAdmin,
  isRecapGenerated,
  onOpenCheckpointModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'collage' | 'grid'>('collage');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);

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

  const currentPhoto = currentPhotoIndex !== null ? filteredAlbumItems[currentPhotoIndex] : null;

  // Keyboard navigation for step-by-step one-by-one photo browsing
  const handlePrevPhoto = useCallback(() => {
    if (currentPhotoIndex !== null && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (currentPhotoIndex === 0) {
      setCurrentPhotoIndex(filteredAlbumItems.length - 1);
    }
  }, [currentPhotoIndex, filteredAlbumItems.length]);

  const handleNextPhoto = useCallback(() => {
    if (currentPhotoIndex !== null && currentPhotoIndex < filteredAlbumItems.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (currentPhotoIndex === filteredAlbumItems.length - 1) {
      setCurrentPhotoIndex(0);
    }
  }, [currentPhotoIndex, filteredAlbumItems.length]);

  useEffect(() => {
    if (currentPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'Escape') {
        setCurrentPhotoIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhotoIndex, handlePrevPhoto, handleNextPhoto]);

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
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[94vh]"
      >
        {/* Modal Topbar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Álbum & Collage de Fotos • Budapest
                </h2>
                {isAdmin && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                    Modo Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isRecapGenerated
                  ? 'Viaje finalizado • Colección interactiva de recuerdos'
                  : 'Vista previa de administrador • Viaje en curso'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isRecapGenerated && (
              <>
                <button
                  id="print-recap-btn"
                  type="button"
                  onClick={handlePrint}
                  title="Imprimir o Guardar en PDF"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  id="export-recap-btn"
                  type="button"
                  onClick={handleExportAlbumJson}
                  title="Descargar datos en JSON"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              id="close-recap-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isRecapGenerated && !isAdmin ? (
          /* LOCKED STATE FOR REGULAR USERS */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                El Viaje a Budapest Sigue en Curso
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tus fotos y lugares marcados como visitados se están guardando de forma segura. El
                recap y collage fotográfico completo se desbloquearán cuando termine el viaje y el
                administrador active el fin del viaje.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
              <div className="text-center">
                <span className="block text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {visitedCount}
                </span>
                <span>Sitios visitados</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <span className="block text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  {albumItems.length}
                </span>
                <span>Fotos guardadas</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Entendido, volver a la lista
            </button>
          </div>
        ) : (
          /* UNLOCKED RECAP & COLLAGE FOR USERS (OR ADMIN PREVIEW) */
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Trip Completion Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-5 sm:p-6 shadow-lg border border-slate-700">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Collage Oficial • Budapest 2026</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    {completionPercentage >= 75
                      ? '¡Aventura Inolvidable en Budapest!'
                      : 'Recuerdos del Viaje a Budapest'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                    Has recorrido {visitedCount} de los {totalPlaces} sitios emblemáticos con{' '}
                    {albumItems.length} fotografías tomadas en el camino.
                  </p>
                </div>

                {/* Dial / Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                    <div className="text-center">
                      <p className="text-2xl font-mono font-black text-emerald-400">
                        {completionPercentage}%
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
                        Visitado
                      </p>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                      <p className="text-2xl font-mono font-black text-amber-400">
                        {albumItems.length}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
                        Fotos
                      </p>
                    </div>
                  </div>

                  {albumItems.length > 0 && (
                    <button
                      id="start-slideshow-btn"
                      type="button"
                      onClick={() => setCurrentPhotoIndex(0)}
                      className="px-3.5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition-all active:scale-95 shrink-0"
                      title="Ver fotos una a una en modo historia"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-mono tracking-wider">Ver 1 a 1</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* COLLAGE GALLERY SECTION */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Collage de Recuerdos ({filteredAlbumItems.length} fotos)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Toca cualquier foto para navegar una a una
                  </span>
                </div>

                {/* Filter Category */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
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
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all shrink-0 ${
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

              {/* Photos Collage Mosaic */}
              {filteredAlbumItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <Camera className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Aún no hay fotos en este álbum
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Al marcar los lugares como visitados, puedes subir fotos desde la tarjeta de cada
                    sitio.
                  </p>
                </div>
              ) : (
                /* Dynamic Polaroid-style Travel Collage Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {filteredAlbumItems.map((item, index) => {
                    // Stagger collage aspect ratios slightly for authentic scrapbook feel
                    const isFeature = index % 5 === 0;
                    return (
                      <div
                        key={`${item.placeId}-${item.photoIndex}-${index}`}
                        id={`collage-photo-${index}`}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`group relative rounded-xl overflow-hidden cursor-pointer bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-xl transition-all duration-200 hover:-translate-y-1 ${
                          isFeature ? 'aspect-4/3 sm:aspect-16/10' : 'aspect-square'
                        }`}
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.placeTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Collage Card Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 sm:p-2.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-amber-300 backdrop-blur-xs">
                              #{index + 1}
                            </span>
                            <span className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-3 h-3" />
                            </span>
                          </div>

                          <div>
                            <p className="text-white text-xs font-bold line-clamp-1 drop-shadow-xs">
                              {item.placeTitle}
                            </p>
                            {item.notes ? (
                              <p className="text-[10px] text-amber-200 line-clamp-1 italic">
                                "{item.notes}"
                              </p>
                            ) : item.locationName ? (
                              <p className="text-[10px] text-slate-300 line-clamp-1">
                                {item.locationName}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Breakdown by areas */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Resumen por Zonas y Balnearios
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-base">{c.icon}</span>
                        <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">
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
          </div>
        )}
      </div>

      {/* STEP-BY-STEP ONE-BY-ONE PHOTO VIEWER (LIGHTBOX CAROUSEL) */}
      {currentPhoto && currentPhotoIndex !== null && (
        <div
          id="photo-step-viewer"
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in"
        >
          {/* Topbar of Viewer */}
          <div className="flex justify-between items-center text-white pb-2 shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-mono font-black">
                {currentPhotoIndex + 1} / {filteredAlbumItems.length}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {currentPhoto.placeTitle}
                </h3>
                {currentPhoto.originalName && (
                  <p className="text-[11px] text-slate-400 italic truncate hidden sm:block">
                    {currentPhoto.originalName}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPhotoIndex(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Image with Next and Previous arrows */}
          <div className="relative flex-1 flex items-center justify-center min-h-0 my-3">
            {/* Previous Arrow Button */}
            <button
              id="viewer-prev-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-1 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all active:scale-95 shadow-lg"
              title="Foto anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo Container */}
            <div className="max-w-full max-h-full flex items-center justify-center px-8 sm:px-16">
              <img
                src={currentPhoto.photoUrl}
                alt={currentPhoto.placeTitle}
                className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10 select-none"
              />
            </div>

            {/* Next Arrow Button */}
            <button
              id="viewer-next-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-1 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all active:scale-95 shadow-lg"
              title="Foto siguiente (Flecha Derecha)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Info & Thumbnail Strip */}
          <div className="pt-2 border-t border-white/10 shrink-0 space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-slate-300">
              <div>
                {currentPhoto.notes ? (
                  <p className="text-amber-300 italic font-medium">"{currentPhoto.notes}"</p>
                ) : (
                  <p className="text-slate-400">Recuerdo guardado en Budapest</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                {currentPhoto.visitedAt && (
                  <span>
                    {new Date(currentPhoto.visitedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {onOpenCheckpointModal && (
                  <button
                    type="button"
                    onClick={() => {
                      const p = places.find((pl) => pl._id === currentPhoto.placeId);
                      if (p) {
                        setCurrentPhotoIndex(null);
                        onOpenCheckpointModal(p, true);
                      }
                    }}
                    className="flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Cambiar foto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Thumbnails Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {filteredAlbumItems.map((item, idx) => (
                <button
                  key={`thumb-${idx}`}
                  type="button"
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    idx === currentPhotoIndex
                      ? 'border-amber-400 scale-105 opacity-100 shadow-md'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
