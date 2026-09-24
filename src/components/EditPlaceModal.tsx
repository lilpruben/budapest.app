import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Edit3,
  MapPin,
  ExternalLink,
  ImageIcon,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Place, PlaceCategory, PlacePriority } from '../types';
import { getLandmarkPhoto, BUDAPEST_VERIFIED_LANDMARK_PHOTOS } from '../data/landmarkImages';

interface EditPlaceModalProps {
  isOpen: boolean;
  place: Place | null;
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<Place>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void> | void;
}

export const EditPlaceModal: React.FC<EditPlaceModalProps> = ({
  isOpen,
  place,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('pest');
  const [priority, setPriority] = useState<PlacePriority>('recomendado');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [googleMapsQuery, setGoogleMapsQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tip, setTip] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [metroOrTransit, setMetroOrTransit] = useState('');
  const [priceCategory, setPriceCategory] = useState<
    'free' | 'museum' | 'food' | 'bar' | 'transport' | 'hotel'
  >('free');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever selected place changes
  useEffect(() => {
    if (place) {
      setTitle(place.title || '');
      setOriginalName(place.originalName || '');
      setCategory(place.category || 'pest');
      setPriority(place.priority || 'recomendado');
      setDescription(place.description || '');
      setLocationName(place.locationName || '');
      setGoogleMapsQuery(place.googleMapsQuery || '');
      setImageUrl(place.imageUrl || (place.photos?.[0] ? '' : ''));
      setTip(place.tip || '');
      setWebsite(place.website || '');
      setPhone(place.phone || '');
      setPrice(place.price || '');
      setOpeningHours(place.openingHours || '');
      setMetroOrTransit(place.metroOrTransit || '');
      setPriceCategory(place.priceCategory || 'free');
      setNotes(place.notes || '');
      setIsConfirmingDelete(false);
      setError(null);
    }
  }, [place]);

  if (!isOpen || !place) return null;

  const currentPreviewPhoto =
    imageUrl.trim() ||
    (place.photos && place.photos.length > 0 ? place.photos[0] : '') ||
    getLandmarkPhoto(title, originalName, category);

  const handleRestoreDefaultPhoto = () => {
    const verifiedDefault = getLandmarkPhoto(title, originalName, category);
    setImageUrl(verifiedDefault);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El nombre del lugar es obligatorio');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedData: Partial<Place> = {
        title: title.trim(),
        originalName: originalName.trim() || '',
        category,
        priority,
        description: description.trim(),
        locationName: locationName.trim(),
        googleMapsQuery: googleMapsQuery.trim() || title.trim(),
        imageUrl: imageUrl.trim() || undefined,
        tip: tip.trim(),
        website: website.trim(),
        phone: phone.trim(),
        price: price.trim(),
        openingHours: openingHours.trim(),
        metroOrTransit: metroOrTransit.trim(),
        priceCategory,
        notes: notes.trim(),
      };

      const success = await onSave(place._id, updatedData);
      if (success) {
        onClose();
      } else {
        setError('Error al guardar los cambios en el servidor');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar el lugar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await onDelete(place._id);
      setIsConfirmingDelete(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al eliminar el lugar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        id="edit-place-modal"
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Edit3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Modificar Lugar de la Checklist
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Edita textos, fotografía real, horarios o elimina el lugar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Preview & Custom URL section */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>Fotografía Verídica del Sitio</span>
              </label>
              <button
                type="button"
                onClick={handleRestoreDefaultPhoto}
                className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                title="Cargar la foto oficial verificada de Budapest"
              >
                <Sparkles className="w-3 h-3" />
                <span>Foto oficial verificada</span>
              </button>
            </div>

            {/* Live photo preview banner */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-2xs">
              <img
                src={currentPreviewPhoto}
                alt={title || 'Vista previa'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-white text-[11px] font-mono truncate">
                  {title || 'Vista previa del monumento'}
                </span>
              </div>
            </div>

            <div>
              <input
                id="edit-place-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (URL de foto real)"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none font-mono text-[11px]"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Puedes pegar cualquier enlace de imagen real o dejarlo vacío para usar la fotografía verídica automática de Budapest.
              </p>
            </div>
          </div>

          {/* Titles & Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre en español *
              </label>
              <input
                id="edit-place-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Parlamento de Budapest"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre original en húngaro
              </label>
              <input
                id="edit-place-original-name"
                type="text"
                value={originalName}
                onChange={(e) => setOriginalName(e.target.value)}
                placeholder="Ej. Országház"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoría
              </label>
              <select
                id="edit-place-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PlaceCategory)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none font-medium"
              >
                <option value="pest">Pest (Centro, Parlamento, Bulevares)</option>
                <option value="buda">Buda (Castillo, Colinas, Bastión)</option>
                <option value="termas">Termas & Balnearios</option>
                <option value="ruin-bars">Bares de Ruina & Vida Nocturna</option>
                <option value="cultura">Cultura, Museos & Teatros</option>
                <option value="miradores">Miradores & Parques</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prioridad
              </label>
              <select
                id="edit-place-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PlacePriority)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none font-medium"
              >
                <option value="imprescindible">Imprescindible (Máxima prioridad)</option>
                <option value="recomendado">Recomendado (Muy aconsejado)</option>
                <option value="opcional">Opcional (Si sobra tiempo)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descripción e historia
            </label>
            <textarea
              id="edit-place-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles del sitio, contexto cultural o valor turístico..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium leading-relaxed"
            />
          </div>

          {/* Location & Transport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dirección / Ubicación
              </label>
              <input
                id="edit-place-location"
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ej. Kossuth Lajos tér 1-3, 1055 Budapest"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Transporte público / Metro
              </label>
              <input
                id="edit-place-transit"
                type="text"
                value={metroOrTransit}
                onChange={(e) => setMetroOrTransit(e.target.value)}
                placeholder="Ej. Metro M2 (Kossuth tér) o Tranvía 2"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Hours & Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Horario de apertura
              </label>
              <input
                id="edit-place-hours"
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Ej. 08:00 - 18:00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Precio / Tarifa
              </label>
              <input
                id="edit-place-price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej. Gratuito / 5.000 HUF"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Web & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Página web oficial
              </label>
              <input
                id="edit-place-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono de contacto
              </label>
              <input
                id="edit-place-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+36 1 ..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Tip & Personal Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Consejo / Tip para el viaje
              </label>
              <textarea
                id="edit-place-tip"
                rows={2}
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                placeholder="Ej. Ir al atardecer para ver el reflejo en el río..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notas personales de Sany & Rubén
              </label>
              <textarea
                id="edit-place-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Apuntes, impresiones, recordatorios..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* DANGER ZONE: DELETE PLACE */}
          <div className="mt-4 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-rose-900 dark:text-rose-300 text-xs">
                  Borrar este lugar de la checklist
                </h4>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-400">
                  Esta acción elimina permanentemente el lugar de la lista y la base de datos.
                </p>
              </div>

              {isConfirmingDelete ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                    ¿Confirmar?
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Borrar de la checklist</span>
                </button>
              )}
            </div>
          </div>

          {/* Modal Action Buttons Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Modificaciones'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
