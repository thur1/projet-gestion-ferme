/**
 * Socket.IO Client Hook
 * Connexion WebSocket pour real-time updates
 */

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { env } from '@/config/env';
import { getAccessToken, getStoredUser } from '@/lib/auth';

const SOCKET_URL = env.apiUrl.replace('/api/', '') || 'http://127.0.0.1:8000';

interface SocketEvent {
  type: string;
  data: unknown;
  timestamp: string;
}

interface Notification {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SocketEvent | null>(null);

  // Initialize socket connection
  useEffect(() => {
    let socketInstance: Socket | null = null;

    const connectSocket = async () => {
      try {
        const token = getAccessToken();
        const user = getStoredUser();

        if (!token || !user?.id) {
          console.warn('❌ No session, skipping socket connection');
          return;
        }

        // Create socket connection
        socketInstance = io(SOCKET_URL, {
          auth: {
            token,
            userId: user.id,
          },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        // Event: Connect
        socketInstance.on('connect', () => {
          console.log('✅ Socket connected:', socketInstance?.id);
          setIsConnected(true);
          toast.success('Connexion temps réel établie', {
            description: 'Les mises à jour automatiques sont activées',
          });
        });

        // Event: Disconnect
        socketInstance.on('disconnect', (reason) => {
          console.log('👋 Socket disconnected:', reason);
          setIsConnected(false);
        });

        // Event: Reconnect
        socketInstance.on('reconnect', (attemptNumber) => {
          console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
          toast.info('Reconnexion réussie');
        });

        // Event: Error
        socketInstance.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error.message);
          setIsConnected(false);
        });

        // Event: Notifications
        socketInstance.on('notification', (data: Notification) => {
          console.log('📢 Notification received:', data);
          
          switch (data.type) {
            case 'success':
              toast.success(data.title, { description: data.message });
              break;
            case 'warning':
              toast.warning(data.title, { description: data.message });
              break;
            case 'error':
              toast.error(data.title, { description: data.message });
              break;
            default:
              toast.info(data.title, { description: data.message });
          }
        });

        // Event: Farm created
        socketInstance.on('farm:created', (data) => {
          console.log('🌾 Farm created:', data);
          setLastEvent({ type: 'farm:created', data, timestamp: new Date().toISOString() });
        });

        // Event: Batch created
        socketInstance.on('batch:created', (data) => {
          console.log('🐔 Batch created:', data);
          setLastEvent({ type: 'batch:created', data, timestamp: new Date().toISOString() });
        });

        // Event: Stock updated
        socketInstance.on('stock:updated', (data) => {
          console.log('📦 Stock updated:', data);
          setLastEvent({ type: 'stock:updated', data, timestamp: new Date().toISOString() });
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('❌ Socket initialization error:', error);
      }
    };

    connectSocket();

    // Cleanup
    return () => {
      if (socketInstance) {
        console.log('🔌 Disconnecting socket...');
        socketInstance.disconnect();
      }
    };
  }, []);

  // Emit event helper
  const emit = useCallback((event: string, data: unknown) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit event:', event);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    lastEvent,
    emit,
  };
}
