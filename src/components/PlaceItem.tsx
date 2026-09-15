import React, { useState, useRef } from 'react';
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
  Camera,
  ImagePlus,
  X,
  Loader2,
  Maximize2,
  Star,
  Globe,
  Phone,
  Coins,
  Info,
  Sparkles,
  Ticket,
  Utensils,
  Bus,
} from 'lucide-react';
import { Place } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface PlaceItemProps {
  place: Place;
  onToggleVisited: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onUploadPhotos?: (id: string, photos: string[]) => Promise<void>;
  onDeletePhoto?: (id: string, photoIndex: number) => Promise<void>;
  isAdmin?: boolean;
  onOpenCheckpointModal?: (place: Place, isExchanging: boolean) => void;
  onOpenDetails?: (place: Place) => void;
}

export const PlaceItem: React.FC<PlaceItemProps> = ({
  place,
  onToggleVisited,
  onDelete,
  onSaveNotes,
  onUploadPhotos,
  onDeletePhoto,
  isAdmin = false,
  onOpenCheckpointModal,
  onOpenDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(place.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onSaveNotes(place._id, notes);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUploadPhotos) return;

    setIsUploadingPhoto(true);
    try {
      const compressedPhotos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file, 1280, 0.8);
          compressedPhotos.push(compressed);
        }
      }

      if (compressedPhotos.length > 0) {
        await onUploadPhotos(place._id, compressedPhotos);
      }
    } catch (err) {
      console.error('Error al subir fotos:', err);
      alert('Hubo un error al procesar las fotos. Intenta de nuevo.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!onDeletePhoto) return;
    if (window.confirm('¿Deseas eliminar esta foto de este lugar?')) {
      await onDeletePhoto(place._id, index);
    }
  };

  const mapsQuery = place.googleMapsQuery || `${place.title} Budapest`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery
  )}`;

  const photoCount = Array.isArray(place.photos) ? place.photos.length : 0;

  const handleToggleClick = () => {
    if (!place.visited) {
      // If not visited yet, check if there's a photo. If no photo, automatically open checkpoint photo modal
      const hasPhoto = Array.isArray(place.photos) && place.photos.length > 0;
      if (!hasPhoto && onOpenCheckpointModal) {
        onOpenCheckpointModal(place, false);
        return;
      }
    }
    onToggleVisited(place._id, place.visited);
  };

  return (
    <article
      id={`place-card-${place._id}`}
      className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
    >
      {/* High Density Row */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5">
        {/* Toggle Checkbox matching High Density Theme */}
        <button
          id={`toggle-place-${place._id}`}
          type="button"
          onClick={handleToggleClick}
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

        {/* Thumbnail preview if has photo */}
        {photoCount > 0 && place.photos?.[0] && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewPhoto(place.photos![0]);
            }}
            className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs group/thumb hover:scale-105 transition-transform"
            title="Ver foto del recuerdo a pantalla completa"
          >
            <img
              src={place.photos[0]}
              alt={place.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </button>
        )}

        {/* Title, Subtitle, and District */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 min-w-0 cursor-pointer select-none"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
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
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {place.locationName || `${place.category.toUpperCase()} • Budapest`}
            </p>
            {place.price && (
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60 truncate max-w-[170px]">
                {place.price.includes('Gratis') || place.price.includes('gratuito')
                  ? 'Gratis'
                  : place.price.split('|')[0].trim()}
              </span>
            )}
            {place.phone && (
              <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                <Phone className="w-2.5 h-2.5" /> Tel
              </span>
            )}
            {place.website && (
              <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                <Globe className="w-2.5 h-2.5" /> Web
              </span>
            )}
          </div>
        </div>

        {/* Right Status Pill, Details Button & Expand Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {place.priority === 'imprescindible' && (
            <span className="hidden xs:inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>TOP</span>
            </span>
          )}

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              place.visited
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            {place.visited ? 'Visitado' : 'Pendiente'}
          </span>

          {/* Direct Details Modal Trigger Button */}
          <button
            id={`details-btn-${place._id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.(place);
            }}
            className="px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-1 active:scale-95 shadow-2xs"
            title="Ver detalles: teléfono, web, precios y horarios"
          >
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Detalles</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Details Tray */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 pt-1 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3.5 animate-in fade-in duration-150">
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

          {/* Practical Info Card: Web, Phone, Cost & Hours */}
          <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>Datos Prácticos: Precios, Web & Contacto</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenDetails?.(place)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Ver ficha completa</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Cost / Price */}
              {place.price && (
                <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 flex items-start gap-2">
                  <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase text-amber-800 dark:text-amber-300">
                      ¿Cuánto suele costar?
                    </span>
                    <span className="leading-snug">{place.price}</span>
                  </div>
                </div>
              )}

              {/* Phone call */}
              {place.phone ? (
                <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold block text-[10px] uppercase text-emerald-800 dark:text-emerald-300">
                        Teléfono
                      </span>
                      <a
                        href={`tel:${place.phone.replace(/\s+/g, '')}`}
                        className="font-mono text-xs hover:underline text-emerald-700 dark:text-emerald-300 font-semibold truncate block"
                      >
                        {place.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${place.phone.replace(/\s+/g, '')}`}
                    className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shrink-0 transition-colors"
                  >
                    Llamar
                  </a>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-[11px]">Sin teléfono registrado</span>
                </div>
              )}

              {/* Official Website */}
              {place.website ? (
                <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-blue-950 dark:text-blue-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold block text-[10px] uppercase text-blue-800 dark:text-blue-300">
                        Página Web
                      </span>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:underline text-blue-700 dark:text-blue-300 font-semibold truncate block"
                      >
                        Visitar web oficial
                      </a>
                    </div>
                  </div>
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shrink-0 transition-colors"
                    title="Abrir web"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px]">Acceso público libre</span>
                </div>
              )}

              {/* Opening Hours */}
              {place.openingHours && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase text-slate-500 dark:text-slate-400">
                      Horarios
                    </span>
                    <span className="leading-snug">{place.openingHours}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

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

          {/* Photo Gallery & Checkpoint Memory Section */}
          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>Foto del Checkpoint</span>
              </div>

              {/* Action trigger */}
              {photoCount > 0 ? (
                <button
                  type="button"
                  onClick={() => onOpenCheckpointModal?.(place, true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 transition-all shadow-2xs"
                  title="Cambiar la foto actual por otra nueva"
                >
                  <Camera className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Cambiar foto</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenCheckpointModal?.(place, false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-2xs"
                  title="Hacer foto y marcar este lugar"
                >
                  <Camera className="w-3 h-3" />
                  <span>Hacer foto</span>
                </button>
              )}
            </div>

            {/* Official Photo Card */}
            {photoCount > 0 && place.photos?.[0] ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                {/* Photo frame with zoom */}
                <div
                  className="relative group/photo w-full sm:w-36 h-28 sm:h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0 cursor-pointer"
                  onClick={() => setPreviewPhoto(place.photos![0])}
                  title="Haz clic para ver la foto en grande"
                >
                  <img
                    src={place.photos[0]}
                    alt={`Recuerdo de ${place.title}`}
                    className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Ver</span>
                  </div>
                </div>

                {/* Photo info & exchange quick button */}
                <div className="flex-1 min-w-0 text-left w-full">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      FOTO GUARDADA
                    </span>
                    {place.visitedAt && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(place.visitedAt))}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    Esta es tu foto del recuerdo para este monumento. Si no te convence o tomaste una mejor, puedes cambiarla en cualquier momento.
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onOpenCheckpointModal?.(place, true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Cambiar por otra foto</span>
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(place.photos![0])}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Ver pantalla completa</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* No photo state */
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                  <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      {place.visited
                        ? '¡Falta la foto obligatoria de este lugar!'
                        : 'Lugar pendiente de visita'}
                    </span>
                    <span className="text-[11px] text-amber-800/80 dark:text-amber-400">
                      {place.visited
                        ? 'Al estar visitado debe tener su foto de recuerdo. Hazte una foto ahora.'
                        : 'Al marcar este checkpoint se abrirá la cámara para que te hagas tu foto aquí.'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCheckpointModal?.(place, false)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-2xs transition-all"
                >
                  Hacer Foto
                </button>
              </div>
            )}
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

            {/* Delete button: only accessible for admin or with confirmation */}
            <div>
              {isConfirmingDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    ¿Eliminar?
                  </span>
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

      {/* Lightbox Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewPhoto}
              alt={place.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white text-xs mt-2 font-bold">{place.title}</p>
          </div>
        </div>
      )}
    </article>
  );
};
