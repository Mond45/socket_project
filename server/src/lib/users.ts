import { prisma } from "./prisma";
import { IUser } from "@common/types";

interface IConnectedSocket {
  socket_id: string;
  username: string;
}

let connectedSockets: IConnectedSocket[] = [];

export async function registerUser(username: string, password: string) {
  try {
    await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function loginUser(
  socket_id: string,
  username: string,
  password: string
): Promise<IUser | null> {
  const user = await prisma.user.findFirst({
    where: {
      username,
      password,
    },
    select: {
      id: true,
      username: true,
      status: true,
    },
  });
  if (user) {
    connectedSockets.push({ socket_id, username });
  }
  return user;
}

export async function setStatus(user_id: string, status: string) {
  try {
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        status,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getConnectedUsers(): Promise<IUser[]> {
  const connectedUsers = await prisma.user.findMany({
    where: {
      username: {
        in: connectedSockets.map((s) => s.username),
      },
    },
    select: {
      id: true,
      username: true,
      status: true,
    },
  });
  return connectedUsers;
}

export function disconnectUser(socket_id: string) {
  connectedSockets = connectedSockets.filter((s) => s.socket_id !== socket_id);
}
