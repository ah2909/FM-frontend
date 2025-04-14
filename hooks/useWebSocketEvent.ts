// hooks/useWebSocketEvent.ts
import { useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

export const useWebSocketEvent = <T>(
  eventName: string,
  stream: string,
  callback: (data: T) => void
): void => {
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected || !eventName) return;

    subscribe(stream);
    const handler = (data: T) => callback(data);
    socket.on(eventName, handler);

    return () => {
        socket.off(eventName, handler);
        unsubscribe(stream);
    };
  }, [stream]);
};