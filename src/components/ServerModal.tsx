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
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 max-h-[90vh] flex flex-col text-xs text-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Servidor & Conexión MongoDB
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Node.js + Mongoose + Base de Datos
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

        {/* Tab navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 font-bold rounded-lg text-center transition-all ${
              activeTab === 'status'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Estado BD & Semilla
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('render')}
            className={`flex-1 py-1.5 font-bold rounded-lg text-center transition-all ${
              activeTab === 'render'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Deploy en Render
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('homeserver')}
            className={`flex-1 py-1.5 font-bold rounded-lg text-center transition-all ${
              activeTab === 'homeserver'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
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
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    {dbStatus?.connected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Conectado a MongoDB activo
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Modo Almacenamiento Local (Seed Activo)
                      </>
                    )}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-white border border-slate-200 text-slate-700">
                    {dbStatus?.mode?.toUpperCase() || 'MEMORIA'}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed opacity-90">
                  {dbStatus?.connected
                    ? `Operando sobre la base de datos '${dbStatus.databaseName}' en el host '${dbStatus.host}'. Todos los checks se persisten en MongoDB con Mongoose.`
                    : `La aplicación está funcionando con el dataset semilla precargado de monumentos de Budapest. Si configuras la variable MONGODB_URI, se conectará automáticamente a tu MongoDB Atlas o servidor local.`}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium">
                  <span>Puntos registrados:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {dbStatus?.count || 0}
                  </span>
                </div>
              </div>

              {/* Seed Reset and Export Actions */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  Restaurar Semilla de Budapest
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Restaura los 14 sitios emblemáticos originales (Parlamento, Bastión, Castillo de Buda, Széchenyi, Ruin Pubs...) si has borrado o modificado los datos de prueba.
                </p>
                <button
                  id="reset-seed-btn"
                  type="button"
                  onClick={handleReset}
                  disabled={isResetting}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? 'Restaurando...' : 'Re-ejecutar Seed de Budapest'}</span>
                </button>
                {resetMessage && (
                  <p className="text-[11px] text-emerald-600 font-bold text-center">
                    {resetMessage}
                  </p>
                )}
              </div>

              {/* Download JSON Export */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Exportar Checklist en JSON</h4>
                  <p className="text-[11px] text-slate-500">Descarga tus sitios y estado visitado</p>
                </div>
                <a
                  href="/api/places/export"
                  download="budapest-checklist.json"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            </>
          )}

          {activeTab === 'render' && (
            <div className="space-y-2.5">
              <p className="text-slate-600 leading-relaxed font-medium">
                Para desplegar este repositorio gratis en <strong>Render.com</strong>:
              </p>

              <ol className="space-y-1.5 list-decimal list-inside text-slate-600">
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
                  <div className="flex items-center justify-between text-emerald-300">
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
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  Variable de Entorno en Render:
                </span>
                <code className="text-slate-900 block bg-white p-2 rounded border border-slate-200 break-all select-all font-mono text-[10px]">
                  MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/budapest?retryWrites=true&w=majority
                </code>
              </div>
            </div>
          )}

          {activeTab === 'homeserver' && (
            <div className="space-y-2.5">
              <p className="text-slate-600 leading-relaxed font-medium">
                Para ejecutarla localmente en tu <strong>servidor de casa</strong> (Raspberry Pi, Mini PC, Docker o Proxmox):
              </p>

              <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-2">
                <span className="text-slate-400 block"># 1. Clona e instala:</span>
                <div className="text-slate-200">
                  git clone &lt;tu-repo&gt; &amp;&amp; cd budapest-checklist
                </div>
                <div className="text-slate-200">npm install</div>

                <span className="text-slate-400 block mt-1"># 2. Conecta MongoDB local o Docker:</span>
                <div className="text-emerald-300">
                  docker run -d -p 27017:27017 --name mongo-budapest mongo:latest
                </div>

                <span className="text-slate-400 block mt-1"># 3. Inicia la app:</span>
                <div className="text-amber-300">
                  MONGODB_URI=mongodb://localhost:27017/budapest npm start
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                La app escuchará en el puerto 3000 de tu servidor local y podrás acceder desde el navegador de tu móvil conectado al WiFi de casa (ej. <code className="text-slate-900 font-bold">http://192.168.1.50:3000</code>).
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
