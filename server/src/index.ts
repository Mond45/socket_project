import { Server } from "socket.io";
import { createServer } from "http";
import {
  disconnectUser,
  getConnectedUsers,
  getSocketsByUserIds,
  loginUser,
  registerUser,
  setStatus,
} from "./lib/users";
import { IUser } from "@common/types";
import {
  createChatRoom,
  enterChatRoom,
  getChatRooms,
  getMessages,
  sendMessage,
  unsendMessage,
} from "./lib/chat";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("disconnect", async () => {
    console.log(`socket disconnected ${socket.id}`);
    disconnectUser(socket.id);
    io.emit("server-users", await getConnectedUsers());
  });

  socket.on(
    "client-login",
    async (
      { username, password }: { username: string; password: string },
      callback
    ) => {
      console.log(`client-login: ${username}, ${password}`);
      const user = await loginUser(socket, username, password);
      callback(user);
      if (user) {
        socket.emit("server-login", user);
        io.emit("server-users", await getConnectedUsers());
        const rooms = await getChatRooms();
        for (const room of rooms?.filter((room) => {
          if (!room.group) {
            return room.members.map((m) => m.username).includes(username);
          }
          return true;
        })) {
          socket.join(room.id);
          io.to(socket.id).emit(
            "server-messages",
            room.id,
            await getMessages(room.id)
          );
        }
        io.to(socket.id).emit("server-chat-rooms", await getChatRooms());
      }
    }
  );

  socket.on(
    "client-register",
    async (
      { username, password }: { username: string; password: string },
      callback
    ) => {
      console.log(`client-register: ${username}, ${password}`);
      const res = await registerUser(username, password);
      callback(res);
    }
  );

  socket.on(
    "client-create-dm",
    async ({ user1, user2 }: { user1: IUser; user2: IUser }) => {
      console.log(`client-create-dm: ${user1.username}, ${user2.username}`);
      const room = await createChatRoom(
        `${user1.username} - ${user2.username}`,
        [user1.id, user2.id],
        false
      );
      if (room) {
        getSocketsByUserIds([user1.id, user2.id]).forEach((socket) => {
          socket.join(room.id);
        });
        io.to(room.id).emit("server-chat-rooms", await getChatRooms());
      }
    }
  );

  socket.on("client-create-group", async ({ name, members }) => {
    console.log(`client-create-group: ${name}, ${members}`);
    const room = await createChatRoom(name, members, true);
    if (room) {
      getSocketsByUserIds(members).forEach((socket) => {
        socket.join(room.id);
      });
      io.emit("server-chat-rooms", await getChatRooms());
    }
  });

  socket.on("client-join-room", async ({ userId, roomId }) => {
    console.log(`client-join-room: ${userId}, ${roomId}`);
    socket.join(roomId);
    await enterChatRoom(userId, roomId);
    io.to(roomId).emit("server-chat-rooms", await getChatRooms());
    io.to(roomId).emit("server-messages", roomId, await getMessages(roomId));
  });

  socket.on("client-send-message", async ({ roomId, content, userId }) => {
    console.log(`client-send-message: ${roomId}, ${content}, ${userId}`);
    await sendMessage(userId, roomId, content);
    io.to(roomId).emit("server-messages", roomId, await getMessages(roomId));
  });

  socket.on('client-unsend-message', async ({ message_id, room_id }) => {
    console.log(`client-unsend-message: ${message_id}, ${room_id}`);
    await unsendMessage(message_id);
    io.to(room_id).emit("server-messages", room_id, await getMessages(room_id));
  });

  socket.on("client-set-status", async ({ user_id, status }) => {
    console.log(`client-set-status: ${user_id}, ${status}`);
    await setStatus(user_id, status);
    io.emit("server-users", await getConnectedUsers());
  });
});

httpServer.listen(65535);
