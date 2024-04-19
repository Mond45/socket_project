import { Server } from "socket.io";
import { createServer } from "http";
import { addUser, getUsers, register, removeUser, try_login } from "./db/users";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
    removeUser(socket.id);
    io.emit("server-users", getUsers());
  });

  socket.on(
    "client-register",
    ({ username, password }: { username: string; password: string }) => {
      register(username, password);
    }
  );

  socket.on(
    "client_login",
    ({ username, password }: { username: string; password: string }) => {
      if (try_login(username, password)) {
        addUser(socket.id, username);
        io.emit("server-login", { success: true });
        io.emit("server-users", getUsers());
      } else {
        io.emit("server-login", { success: false });
      }
    }
  );

  socket.on("client-send-message", ({ message }: { message: string }) =>
    io.emit("server-send-message", { message })
  );
});

httpServer.listen(65535);
