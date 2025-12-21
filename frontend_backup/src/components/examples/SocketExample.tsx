/**
 * Exemple d'utilisation de Socket.IO
 * Notifications temps réel et indicateur de connexion
 */

import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Zap } from 'lucide-react';

export function SocketExample() {
  const { socket, isConnected, lastEvent, emit } = useSocket();
  const [events, setEvents] = useState<any[]>([]);

  // Écouter les événements et les afficher
  useEffect(() => {
    if (lastEvent) {
      setEvents(prev => [lastEvent, ...prev].slice(0, 10)); // Garder les 10 derniers
    }
  }, [lastEvent]);

  const handleTestNotification = () => {
    emit('test:notification', {
      message: 'Test de notification',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Indicateur de connexion */}
      <div className={`rounded-xl border-2 p-6 ${
        isConnected 
          ? 'border-green-200 bg-green-50' 
          : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <Wifi className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-green-900">Connecté en temps réel</h3>
                  <p className="text-sm text-green-700">Socket ID: {socket?.id}</p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-bold text-red-900">Déconnecté</h3>
                  <p className="text-sm text-red-700">Reconnexion automatique...</p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleTestNotification}
            disabled={!isConnected}
            className="flex items-center gap-2 rounded-lg bg-[#2e8b57] px-4 py-2 text-sm font-medium text-white hover:bg-[#256f46] disabled:opacity-50 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Tester notification
          </button>
        </div>
      </div>

      {/* Liste des événements reçus */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Événements temps réel
        </h3>

        {events.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            Aucun événement reçu. Les notifications apparaîtront ici en temps réel.
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-[#2e8b57]">
                    {event.type}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString('fr-FR')}
                  </span>
                </div>
                <pre className="mt-2 text-xs text-slate-700 overflow-x-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations techniques */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Socket.IO actif</strong> - Connexion WebSocket établie avec le backend. 
          Les notifications sont envoyées instantanément (latence {'<'} 100ms).
        </p>
        <ul className="mt-2 text-xs text-blue-800 space-y-1">
          <li>✅ Auto-reconnect activé</li>
          <li>✅ Fallback polling si WebSocket échoue</li>
          <li>✅ Toast notifications automatiques</li>
          <li>✅ Events: farm:created, batch:created, stock:updated</li>
        </ul>
      </div>
    </div>
  );
}
