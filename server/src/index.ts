import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  socket.on("client-send-message", ({ message }: { message: string }) =>
    io.emit("server-send-message", { message })
  );
});

httpServer.listen(65535);
