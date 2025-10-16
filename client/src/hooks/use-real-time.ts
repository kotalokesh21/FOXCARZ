import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:8001' : window.location.origin;

export const useRealTime = <T>(eventName: string, initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on(eventName, (newData: T) => {
      setData(newData);
    });

    return () => {
      newSocket.close();
    };
  }, [eventName]);

  return { data, socket };
};