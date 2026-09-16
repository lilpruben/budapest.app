import React, { useState } from 'react';
import {
  X,
  Globe,
  Phone,
  Coins,
  Clock,
  Navigation,
  MapPin,
  Lightbulb,
  ExternalLink,
  Check,
  Camera,
  FileText,
  Copy,
  CheckCheck,
  Utensils,
  Landmark,
  Wine,
  Bus,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { getLandmarkPhoto } from '../data/landmarkImages';

const CATEGORY_NAMES: Record<PlaceCategory, string> = {
  buda: 'Buda (Castillo & Colinas)',
  pest: 'Pest (Centro & Danubio)',
  termas: 'Termas & Balnearios',
  'ruin-bars': 'Ruin Bars & Noche',
  cultura: 'Cultura & Museos',
  miradores: 'Miradores Panorámicos',
};

const CATEGORY_COLORS: Record<PlaceCategory, { bg: string; text: string; border: string }> = {
  buda: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  pest: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  termas: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-800 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  'ruin-bars': {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  cultura: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
  },
  miradores: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
};

interface PlaceDetailModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleVisited: (id: string, currentStatus: boolean) => Promise<void>;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onOpenCheckpointPhoto?: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  isOpen,
  onClose,
  onToggleVisited,
  onSaveNotes,
  onOpenCheckpointPhoto,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [userNotes, setUserNotes] = useState(place?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Sync state if place changes
  React.useEffect(() => {
    if (place) {
      setUserNotes(place.notes || '');
      setCopiedPhone(false);
      setNotesSavedSuccess(false);
    }
  }, [place]);

  if (!isOpen || !place) return null;

  const categoryStyle = CATEGORY_COLORS[place.category] || CATEGORY_COLORS.pest;

  const handleCopyPhone = () => {
    if (!place.phone) return;
    navigator.clipboard.writeText(place.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onSaveNotes(place._id, userNotes);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 2500);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const encodedQuery = encodeURIComponent(
    place.googleMapsQuery || `${place.title} Budapest`
  );
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;

  // Helper for price tag badge
  const getPriceBadge = () => {
    if (!place.price) return null;
    const lower = place.price.toLowerCase();
    if (lower.includes('gratis') || lower.includes('gratuito') || lower.includes('libre')) {
      return {
        label: 'Acceso Gratuito',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        icon: Sparkles,
      };
    }
    if (place.category === 'ruin-bars') {
      return {
        label: 'Consumición / Bar',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        icon: Wine,
      };
    }
    if (lower.includes('comer') || lower.includes('food') || lower.includes('menú') || lower.includes('burger')) {
      return {
        label: 'Precio por comer',
        bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
        icon: Utensils,
      };
    }
    if (lower.includes('entrada') || lower.includes('taquilla') || place.category === 'cultura') {
      return {
        label: 'Entrada / Ticket',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
        icon: Ticket,
      };
    }
    return {
      label: 'Tarifas estimadas',
      bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: Coins,
    };
  };

  const priceBadge = getPriceBadge();
  const PriceIcon = priceBadge?.icon || Coins;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="place-detail-modal"
        className="w-full sm:max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {CATEGORY_NAMES[place.category]}
              </span>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  place.priority === 'imprescindible'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : place.priority === 'recomendado'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {place.priority.toUpperCase()}
              </span>

              {place.estimatedTimeMinutes && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {place.estimatedTimeMinutes} min aprox
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {place.title}
            </h2>

            {place.originalName && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic">
                {place.originalName}
              </p>
            )}
          </div>

          <button
            id="close-place-detail-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Cerrar detalles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {/* Landmark Photo Showcase Banner */}
          <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md">
            <img
              src={place.photos?.[0] || getLandmarkPhoto(place.title, place.originalName, place.category)}
              alt={place.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end justify-between p-3.5 sm:p-4">
              <div className="text-white text-xs font-mono font-medium drop-shadow-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-md">{place.locationName || 'Budapest, Hungría'}</span>
              </div>
              {place.photos && place.photos.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                  <Camera className="w-3 h-3" />
                  <span>{place.photos.length} recuerdo{place.photos.length > 1 ? 's' : ''}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Highlights Bar (Phone, Web, Route, Visited) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Website Button */}
            {place.website ? (
              <a
                id="place-detail-website-link"
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 flex flex-col items-center justify-center text-center gap-1 transition-all group shadow-2xs"
                title="Abrir página web oficial"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                </div>
                <span className="text-xs font-bold leading-tight flex items-center gap-1">
                  Página Web
                  <ExternalLink className="w-3 h-3 text-blue-400 opacity-70" />
                </span>
                <span className="text-[10px] text-blue-500/80 dark:text-blue-400/70 truncate max-w-full font-mono">
                  Sitio Oficial
                </span>
              </a>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center text-center gap-1 opacity-70">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-semibold">Web no disp.</span>
                <span className="text-[10px]">Acceso libre</span>
              </div>
            )}

            {/* Phone Button */}
            {place.phone ? (
              <div className="relative group">
                <a
                  id="place-detail-phone-call"
                  href={`tel:${place.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex flex-col items-center justify-center text-center gap-1 transition-all w-full shadow-2xs"
                  title={`Llamar a ${place.phone}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <span className="text-xs font-bold leading-tight">Llamar ahora</span>
                  <span className="text-[10px] text-emerald-600/90 dark:text-emerald-400 font-mono truncate max-w-full">
                    {place.phone}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
                  title="Copiar número de teléfono"
                >
                  {copiedPhone ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center text-center gap-1 opacity-70">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-semibold">Sin teléfono</span>
                <span className="text-[10px]">Sin reservas</span>
              </div>
            )}

            {/* Directions / Route Button */}
            <a
              id="place-detail-directions-link"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 flex flex-col items-center justify-center text-center gap-1 transition-all group shadow-2xs"
              title="Calcular ruta a pie o transporte"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Navigation className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              </div>
              <span className="text-xs font-bold leading-tight">Cómo llegar</span>
              <span className="text-[10px] text-amber-600/90 dark:text-amber-400 font-mono">
                Ruta Maps
              </span>
            </a>

            {/* Toggle Visited Button */}
            <button
              id="place-detail-toggle-visited"
              type="button"
              onClick={() => onToggleVisited(place._id, place.visited)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all shadow-2xs ${
                place.visited
                  ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  place.visited
                    ? 'bg-white/20 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-500'
                }`}
              >
                <Check className={`w-4 h-4 ${place.visited ? 'stroke-[3]' : ''}`} />
              </div>
              <span className="text-xs font-bold leading-tight">
                {place.visited ? 'Completado' : 'Marcar visto'}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  place.visited ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {place.visited ? 'Visitado ✓' : 'Pendiente'}
              </span>
            </button>
          </div>

          {/* Detailed Price and Cost Card */}
          <div
            id="place-detail-price-card"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/10 border border-amber-200/80 dark:border-amber-900/50 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <PriceIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    ¿Cuánto suele costar? (Precios & Tarifas)
                  </h3>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                    Orientación en Florines (HUF) y Euros (€)
                  </p>
                </div>
              </div>

              {priceBadge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${priceBadge.bg}`}
                >
                  {priceBadge.label}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pl-1 pt-1">
              {place.price ||
                'Acceso al sitio sin tarifa fija. Consulta en el lugar o en su web oficial.'}
            </p>
          </div>

          {/* Opening Hours & Transit Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opening Hours */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Horarios habituales
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {place.openingHours || 'Abierto habitualmente. Consulta posibles festivos locales.'}
              </p>
            </div>

            {/* Metro & Transit */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Bus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Metro / Transporte
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                {place.metroOrTransit ||
                  place.locationName ||
                  'Accesible a pie o transporte público central de Budapest.'}
              </p>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sobre este lugar
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {place.description}
              </p>
            </div>
          )}

          {/* Traveler's Tip */}
          {place.tip && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wide">
                  Consejo de viajero
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-amber-950 dark:text-amber-100">
                  {place.tip}
                </p>
              </div>
            </div>
          )}

          {/* Photo & Memories section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Foto del Checkpoint & Recuerdo
                </h3>
              </div>
              {onOpenCheckpointPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCheckpointPhoto(place);
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {place.photos && place.photos.length > 0 ? 'Cambiar foto' : 'Subir foto'}
                </button>
              )}
            </div>

            {place.photos && place.photos.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0">
                  <img
                    src={place.photos[0]}
                    alt={place.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    ¡Foto de recuerdo guardada!
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-[11px]">
                    Visible en el Álbum general & Recap de viaje.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Aún no has añadido una foto en este punto. Al marcarlo como visitado puedes sacarte
                una selfie o foto del lugar para tu álbum de viaje.
              </p>
            )}
          </div>

          {/* User Notes Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="place-user-notes"
                className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Tus Notas personales sobre este sitio
              </label>
              {notesSavedSuccess && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3" />
                  ¡Guardado!
                </span>
              )}
            </div>
            <textarea
              id="place-user-notes"
              rows={2}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Apunta qué plato pediste, cuánto pagaste, número de mesa o recordatorios..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none resize-none text-xs font-medium"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSavingNotes ? 'Guardando...' : 'Guardar notas'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
          <a
            href={externalMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir en Google Maps</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-xs"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
};
