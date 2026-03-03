import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { getAccessToken, subscribeToToken } from '@/lib/token-store';

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
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initializeSocket = (token: string | null) => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      if (!token) {
        setSocket(null);
        socketRef.current = null;
        setIsConnected(false);
        return;
      }

      const newSocket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setError(null);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (err: any) => {
        console.error('Connection error:', err);
        setError(err.message);
        setIsConnected(false);
        
        // If it's an auth error, it will likely be handled by the token refresh flow
        if (err.message === "Authentication error: Invalid or expired token") {
            // Wait for refresh
        }
      });

      setSocket(newSocket);
      socketRef.current = newSocket;
    };

    // Initial connection
    const currentToken = getAccessToken();
    initializeSocket(currentToken);

    // Subscribe to token changes
    const unsubscribeToken = subscribeToToken((newToken) => {
      if (newToken && socketRef.current) {
        // Update existing socket auth and reconnect
        socketRef.current.auth = { token: newToken };
        socketRef.current.disconnect().connect();
      } else {
        // Re-initialize (e.g. on logout)
        initializeSocket(newToken);
      }
    });

    return () => {
      unsubscribeToken();
      if (socketRef.current) {
        socketRef.current.close();
      }
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