import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { PlaceCategory, PlacePriority } from '../types';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (data: {
    title: string;
    originalName?: string;
    category: PlaceCategory;
    description: string;
    priority: PlacePriority;
    locationName?: string;
    tip?: string;
  }) => Promise<void>;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
}) => {
  const [title, setTitle] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('pest');
  const [priority, setPriority] = useState<PlacePriority>('recomendado');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [tip, setTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe el nombre del lugar.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onAddPlace({
        title: title.trim(),
        originalName: originalName.trim() || undefined,
        category,
        priority,
        description: description.trim(),
        locationName: locationName.trim() || undefined,
        tip: tip.trim() || undefined,
      });

      // Reset
      setTitle('');
      setOriginalName('');
      setDescription('');
      setLocationName('');
      setTip('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al guardar el lugar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="add-place-modal"
        className="w-full sm:max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Añadir nuevo punto</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Se guardará en MongoDB / Mongoose
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nombre en español *
            </label>
            <input
              id="new-place-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Castillo Vajdahunyad, Baños Rudas..."
              className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none font-medium"
            />
          </div>

          {/* Original Hungarian Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nombre original (húngaro)
            </label>
            <input
              id="new-place-original-name"
              type="text"
              value={originalName}
              onChange={(e) => setOriginalName(e.target.value)}
              placeholder="Ej. Rudas Gyógyfürdő"
              className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none font-medium"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Zona / Categoría
              </label>
              <select
                id="new-place-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PlaceCategory)}
                className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none font-medium"
              >
                <option value="pest">Pest (Este)</option>
                <option value="buda">Buda (Oeste)</option>
                <option value="termas">Termas / Balnearios</option>
                <option value="ruin-bars">Ruin Pubs</option>
                <option value="cultura">Cultura & Monumentos</option>
                <option value="miradores">Miradores</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Prioridad
              </label>
              <select
                id="new-place-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PlacePriority)}
                className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none font-medium"
              >
                <option value="imprescindible">Imprescindible</option>
                <option value="recomendado">Recomendado</option>
                <option value="opcional">Opcional</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Descripción breve
            </label>
            <textarea
              id="new-place-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué hace especial a este sitio? Curiosidades, historia..."
              className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none resize-none font-medium"
            />
          </div>

          {/* Location & Tip */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Dirección o Barrio
            </label>
            <input
              id="new-place-location"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ej. Distrito VII, cerca de Deák Ferenc tér"
              className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Consejo / Tip de viajero
            </label>
            <input
              id="new-place-tip"
              type="text"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="Ej. Mejor reservar por internet para evitar colas..."
              className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              id="save-new-place-submit"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Añadir a la lista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
