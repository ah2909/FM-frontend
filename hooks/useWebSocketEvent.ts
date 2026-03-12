// hooks/useWebSocketEvent.ts
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

export const useWebSocketEvent = <T>(
  eventName: string,
  stream: string,
  callback: (data: T) => void
): void => {
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  //For connecting CEXs stream
  useEffect(() => {
    if (!socket || !isConnected || !eventName || stream === '') return;

    subscribe(stream);
    const handler = (data: T) => callbackRef.current(data);
    socket.on(eventName, handler);

    return () => {
        socket.off(eventName, handler);
        unsubscribe(stream);
    };
  }, [socket, eventName, stream]);

  //For in-app event
  useEffect(() => {
    if (stream !== '') return;
    const handler = (data: T) => callbackRef.current(data);
    socket?.on(eventName, handler)
    return () => {
        socket?.off(eventName, handler);
    };
  }, [socket, eventName, stream]);
};