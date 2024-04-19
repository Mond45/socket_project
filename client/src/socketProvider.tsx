import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Socket, io } from "socket.io-client";

interface IUser {
  id: string;
  username: string;
}

export interface ISocketContext {
  socket?: Socket;
  messages?: string[];
  users?: IUser[];
}

export const SocketContext = createContext<ISocketContext>({});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const navigate = useNavigate();

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
    socket.on("server-users", (users: IUser[]) => {
      setUsers(users);
    });
    socket.on("server-login", ({ success }: { success: boolean }) => {
      if (success) {
        navigate("/main");
      }
    });
  }, [socket, navigate]);

  return (
    <SocketContext.Provider value={{ socket, messages, users }}>
      {children}
    </SocketContext.Provider>
  );
}
