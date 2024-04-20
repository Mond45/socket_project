import { IChatRoom, IMessage, IUser } from "@common/types";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Socket, io } from "socket.io-client";

export interface ISocketContext {
  socket?: Socket;
  loggedUser?: IUser;
  rooms?: IChatRoom[];
  messages?: Record<string, IMessage[]>;
  users?: IUser[];
}

export const SocketContext = createContext<ISocketContext>({});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loggedUser, setLoggedUser] = useState<IUser | undefined>();
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [messages, setMessages] = useState<
    Record<string, IMessage[]>
  >({});
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
    socket.on("server-login", (user: IUser) => {
      if (user) {
        setLoggedUser(user);
      }
    });

    socket.on("server-users", (users: IUser[]) => {
      setUsers(users);
    });

    socket.on("server-chat-rooms", (rooms: IChatRoom[]) => {
      setRooms(rooms);
    });

    socket.on("server-messages", (roomId: string, messages: IMessage[]) => {
      setMessages((prev) => {
        return {
          ...prev,
          [roomId]: messages,
        };
      });
    });

    return () => {
      socket.off("server-login");
      socket.off("server-users");
    };
  }, [socket, navigate]);

  return (
    <SocketContext.Provider
      value={{ socket, loggedUser, users, rooms, messages }}
    >
      {children}
    </SocketContext.Provider>
  );
}
