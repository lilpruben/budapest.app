import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, Compass, MapPin, Camera } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 3200,
}) => {
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsFading(true);
        setTimeout(() => {
          onFinish();
        }, 700); // Allow fade-out animation to complete
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onFinish();
    }, 400);
  };

  return (
    <div
      id="budapest-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 select-none transition-opacity duration-700 overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0f172a 45%, #020617 100%)',
      }}
    >
      {/* Background ambient glow effect */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Skip Button Top Right */}
      <div className="w-full flex justify-end z-10">
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-mono font-medium px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md transition-all border border-white/10"
        >
          Saltar intro →
        </button>
      </div>

      {/* Centerpiece Branding Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full text-center z-10 my-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Ornate Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>Budapest 2026 • Cuaderno de Viaje</span>
        </div>

        {/* Main Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            Viaje a Budapest
          </h1>

          {/* Romantic Couple Names */}
          <div className="relative inline-flex items-center justify-center gap-3 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/40 backdrop-blur-md shadow-lg">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-bounce" />
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-rose-200 to-amber-300 bg-clip-text text-transparent tracking-wide font-display">
              Sany & Rubén
            </span>
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-bounce" />
          </div>

          <p className="text-xs sm:text-sm text-slate-300/90 max-w-xs mx-auto leading-relaxed pt-2">
            Nuestra guía de recuerdos, rincones secretos del Danubio, baños termales y ruinas
          </p>
        </div>

        {/* Decorative Danube & Travel Icons */}
        <div className="flex items-center justify-center gap-6 text-slate-400 pt-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">Rutas</span>
          </div>

          <div className="w-8 h-px bg-white/20" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">Collage</span>
          </div>

          <div className="w-8 h-px bg-white/20" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">40 Sitios</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Loading Text */}
      <div className="w-full max-w-xs space-y-2 z-10 text-center">
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/10 backdrop-blur-xs">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 rounded-full transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
          <span>Cargando viaje</span>
          <span className="text-amber-400">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
