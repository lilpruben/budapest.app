import React, { useState } from 'react';
import {
  X,
  Database,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { DbStatus } from '../types';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: DbStatus | null;
  onResetSeed: () => Promise<void>;
}

export const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  dbStatus,
  onResetSeed,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'status' | 'render' | 'homeserver'>(
    'status'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = async () => {
    if (
      !window.confirm(
        '¿Deseas restaurar la lista original con los sitios semilla de Budapest? Se sobreescribirán los cambios.'
      )
    ) {
      return;
    }
    setIsResetting(true);
    setResetMessage('');
    try {
      await onResetSeed();
      setResetMessage('¡Base de datos restablecida con éxito con los sitios de Budapest!');
    } catch (err: any) {
      setResetMessage(`Error: ${err?.message || 'No se pudo reiniciar'}`);
    } finally {
      setIsResetting(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="server-config-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 max-h-[90vh] flex flex-col text-xs text-slate-700 dark:text-slate-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Servidor & Conexión MongoDB
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Node.js + Mongoose + Base de Datos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 font-bold rounded-lg text-center transition-all ${
              activeTab === 'status'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Estado BD & Semilla
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('render')}
            className={`flex-1 py-1.5 font-bold rounded-lg text-center transition-all ${
              activeTab === 'render'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Deploy en Render
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('homeserver')}
            className={`flex-1 py-1.5 font-bold rounded-lg text-center transition-all ${
              activeTab === 'homeserver'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Servidor Casero
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {activeTab === 'status' && (
            <>
              {/* Connection Status Card */}
              <div
                className={`p-3 rounded-xl border ${
                  dbStatus?.connected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    {dbStatus?.connected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Conectado a MongoDB activo
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        Modo Almacenamiento Local (Seed Activo)
                      </>
                    )}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {dbStatus?.mode?.toUpperCase() || 'MEMORIA'}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed opacity-90">
                  {dbStatus?.connected
                    ? `Operando sobre la base de datos '${dbStatus.databaseName}' en el host '${dbStatus.host}'. Todos los checks se persisten en MongoDB con Mongoose.`
                    : `La aplicación está funcionando con el dataset semilla precargado de monumentos de Budapest. Si configuras la variable MONGODB_URI, se conectará automáticamente a tu MongoDB Atlas o servidor local.`}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-medium">
                  <span>Puntos registrados:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {dbStatus?.count || 0}
                  </span>
                </div>
              </div>

              {/* Seed Reset and Export Actions */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  Restaurar Semilla de Budapest
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Restaura la lista completa de los 40 sitios reales compartidos (Parlamento, Bastión, Dob u. 74, Karaván, Instant-Fogas, Gellért, Ópera, Ruin Bars, etc.).
                </p>
                <button
                  id="reset-seed-btn"
                  type="button"
                  onClick={handleReset}
                  disabled={isResetting}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 active:scale-95 text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? 'Restaurando...' : 'Re-ejecutar Seed de Budapest (40 sitios)'}</span>
                </button>
                {resetMessage && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold text-center">
                    {resetMessage}
                  </p>
                )}
              </div>

              {/* Download JSON Export */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Exportar Checklist en JSON</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Descarga tus sitios y estado visitado</p>
                </div>
                <a
                  href="/api/places/export"
                  download="budapest-checklist.json"
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            </>
          )}

          {activeTab === 'render' && (
            <div className="space-y-2.5">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Para desplegar este repositorio gratis en <strong>Render.com</strong>:
              </p>

              <ol className="space-y-1.5 list-decimal list-inside text-slate-600 dark:text-slate-400">
                <li>Sube este código a tu repositorio de <strong>GitHub</strong>.</li>
                <li>En Render, crea un nuevo <strong>Web Service</strong> conectado a tu repo.</li>
                <li>Configura los comandos:</li>
              </ol>

              <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-2">
                <div>
                  <span className="text-slate-400 block"># Build Command:</span>
                  <div className="flex items-center justify-between text-amber-300">
                    <span>npm run build</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npm run build', 'bcmd')}
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block"># Start Command:</span>
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>npm run start</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npm run start', 'scmd')}
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block"># Environment Variable:</span>
                  <div className="text-sky-300 break-all">
                    <span>MONGODB_URI=mongodb+srv://...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'homeserver' && (
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p>
                Puedes clonar este repositorio y ejecutarlo en tu red local o servidor casero:
              </p>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-1">
                <p className="text-slate-400"># Instalar dependencias y arrancar</p>
                <p className="text-emerald-400">npm install</p>
                <p className="text-emerald-400">npm run build</p>
                <p className="text-emerald-400">npm run start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
