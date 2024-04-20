import { Server } from "socket.io";
import { createServer } from "http";
import { loginUser } from "./lib/users";
import { IUser } from "@common/types";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`socket disconnected ${socket.id}`);
  });

  socket.on(
    "client-login",
    async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }): Promise<IUser | null> => {
      console.log(`client-login: ${username}, ${password}`);
      return await loginUser(socket.id, username, password);
    }
  );

  socket.on(
    "client-register",
    async ({ username, password }): Promise<boolean> => {}
  );
});

httpServer.listen(65535);
