import { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export interface ISocketContext {
  socket?: Socket;
  messages?: string[];
}

export const SocketContext = createContext<ISocketContext>({});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const s = io("http://localhost:65535");
    s.connect();
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("server-send-message", ({ message }: { message: string }) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, messages }}>
      {children}
    </SocketContext.Provider>
  );
}
