import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  subscribe: (stream: string) => void;
  unsubscribe: (stream: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: {
        token: localStorage.getItem('user_id') || '',
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }); // Replace with your WebSocket server URL
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError(err.message);
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const subscribe = (stream: string) => {
    if (socket && isConnected) {
      socket.emit('subscribe', stream);
    }
  };

  const unsubscribe = (stream: string) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe', stream);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, error, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};