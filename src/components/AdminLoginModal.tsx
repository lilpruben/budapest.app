import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  X,
  Database,
  Camera,
  Layers,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { DbStatus } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  dbStatus: DbStatus | null;
  onClose: () => void;
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
  onOpenServerModal: () => void;
  onOpenTripRecap: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  isAdmin,
  dbStatus,
  onClose,
  onLogin,
  onLogout,
  onOpenServerModal,
  onOpenTripRecap,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor ingresa la contraseña de administrador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onLogin(password.trim());
      if (!success) {
        setError('Contraseña incorrecta. (Prueba: budapest2026)');
      } else {
        setPassword('');
      }
    } catch {
      setError('Error al verificar las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="admin-login-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isAdmin
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isAdmin ? 'Panel de Administrador' : 'Acceso de Administrador'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAdmin ? 'Modo desarrollador habilitado' : 'Herramientas avanzadas protegidas'}
              </p>
            </div>
          </div>

          <button
            id="close-admin-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {isAdmin ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Has iniciado sesión como <strong>Administrador</strong>. Tienes acceso completo a
                  la base de datos, servidor y recap del viaje.
                </span>
              </div>

              {/* Developer Actions */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Acciones de Desarrollador
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    id="admin-open-server-btn"
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenServerModal();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Servidor & Base de Datos
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {dbStatus?.connected ? 'MongoDB Atlas Conectado' : 'Almacenamiento Local'} •{' '}
                          {dbStatus?.count ?? 0} lugares
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      Abrir
                    </span>
                  </button>

                  <button
                    id="admin-open-recap-btn"
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTripRecap();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Álbum & Recap del Viaje
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Resumen fotográfico, estadísticas finales y recuerdos
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-mono">
                      Ver Álbum
                    </span>
                  </button>
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="admin-logout-btn"
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión de Administrador</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  El acceso para usuarios finales está simplificado sin detalles técnicos de
                  servidor. Introduce la clave de desarrollador para gestionar la base de datos y
                  el álbum final.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password-input"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  Contraseña de Administrador:
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce la contraseña (ej. budapest2026)"
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  id="submit-admin-login-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-xs disabled:opacity-50 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Verificando...' : 'Iniciar Sesión como Admin'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
