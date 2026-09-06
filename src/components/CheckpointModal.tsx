import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Check,
  RotateCcw,
  X,
  MapPin,
  Sparkles,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { Place } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface CheckpointModalProps {
  isOpen: boolean;
  place: Place | null;
  isExchanging?: boolean;
  onClose: () => void;
  onConfirmPhoto: (placeId: string, photoDataUrl: string) => Promise<void>;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({
  isOpen,
  place,
  isExchanging = false,
  onClose,
  onConfirmPhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Reset state when opening or switching place
  useEffect(() => {
    if (isOpen) {
      setSelectedPhoto(null);
      setErrorMsg(null);
      setIsProcessing(false);
      setIsSaving(false);
    }
  }, [isOpen, place]);

  if (!isOpen || !place) return null;

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const compressed = await compressImage(file, 1280, 0.82);
      setSelectedPhoto(compressed);
    } catch (err: any) {
      console.error('Error al procesar la imagen:', err);
      setErrorMsg('No se pudo procesar la foto. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (e.target) e.target.value = '';
  };

  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (e.target) e.target.value = '';
  };

  const handleConfirm = async () => {
    if (!selectedPhoto) return;
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await onConfirmPhoto(place._id, selectedPhoto);
      onClose();
    } catch (err: any) {
      console.error('Error al guardar la foto:', err);
      setErrorMsg('Error al guardar la foto. Por favor intenta de nuevo.');
      setIsSaving(false);
    }
  };

  const currentDateFormatted = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const currentExistingPhoto = place.photos && place.photos.length > 0 ? place.photos[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div
        id="checkpoint-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
      >
        {/* Hidden inputs for camera capture & gallery */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onCameraChange}
          className="hidden"
          id="camera-direct-input"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={onGalleryChange}
          className="hidden"
          id="gallery-direct-input"
        />

        {/* Header banner */}
        <div className="relative px-5 sm:px-6 pt-5 pb-4 bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button
            id="close-checkpoint-modal-btn"
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-50"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>{isExchanging ? 'Intercambiar Foto' : '¡Checkpoint de Viaje!'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {place.title}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{place.locationName || `${place.category.toUpperCase()} • Budapest`}</span>
          </p>
        </div>

        {/* Modal body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300">
          {/* Informative message */}
          {!selectedPhoto ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {isExchanging ? (
                  <>
                    <strong className="block font-bold mb-0.5">¿Quieres cambiar la foto actual?</strong>
                    Hazte una nueva foto o elige otra de tu galería para sustituir la anterior.
                    Siempre se mantendrá tu foto favorita asociada a este lugar.
                  </>
                ) : (
                  <>
                    <strong className="block font-bold mb-0.5">
                      ¡Para marcar este lugar necesitas tu foto!
                    </strong>
                    Cada monumento visitado debe tener su foto de recuerdo. Hazte una foto ahora o
                    sube una para registrar este checkpoint.
                  </>
                )}
              </div>
            </div>
          ) : null}

          {/* Current photo thumbnail if in exchange mode and no new photo chosen yet */}
          {isExchanging && currentExistingPhoto && !selectedPhoto && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img
                src={currentExistingPhoto}
                alt="Foto actual"
                className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Foto actual guardada
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Al seleccionar una nueva foto se reemplazará por la que elijas.
                </span>
              </div>
            </div>
          )}

          {/* Photo processing loader */}
          {isProcessing && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Procesando y optimizando fotografía...
              </p>
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* When NO photo is selected yet: Large intuitive action triggers */}
          {!selectedPhoto && !isProcessing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Button: Open Camera */}
              <button
                id="checkpoint-open-camera-btn"
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="group p-5 rounded-2xl border-2 border-dashed border-emerald-400/70 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 transition-all flex flex-col items-center text-center gap-2.5 shadow-2xs active:scale-[0.98]"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 block">
                    Hacer Foto Ahora
                  </span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-0.5 block">
                    Abre la cámara directamente
                  </span>
                </div>
              </button>

              {/* Button: Choose from Gallery */}
              <button
                id="checkpoint-open-gallery-btn"
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="group p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 transition-all flex flex-col items-center text-center gap-2.5 active:scale-[0.98]"
              >
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    Subir de Galería
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Seleccionar imagen guardada
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* When a photo HAS BEEN captured/selected: Polaroid Travel Frame Preview */}
          {selectedPhoto && !isProcessing && (
            <div className="flex flex-col items-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
              {/* Polaroid Frame */}
              <div className="w-full max-w-xs bg-white dark:bg-slate-800 p-3 pb-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 rotate-[-0.5deg] transition-transform hover:rotate-0">
                <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                  <img
                    src={selectedPhoto}
                    alt="Foto capturada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>NUEVA FOTO</span>
                  </div>
                </div>

                {/* Polaroid stamp caption */}
                <div className="pt-3 px-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                      {place.title}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      Budapest • {currentDateFormatted}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                </div>
              </div>

              {/* Retake / Change choice trigger */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Elegir otra foto</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal actions footer */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {selectedPhoto ? 'Cancelar' : 'Aún no he llegado'}
          </button>

          {selectedPhoto && (
            <button
              id="confirm-checkpoint-photo-btn"
              type="button"
              onClick={handleConfirm}
              disabled={isSaving}
              className="flex-1 max-w-[280px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando recuerdo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isExchanging ? 'Guardar Nueva Foto' : '¡Completar Checkpoint!'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
