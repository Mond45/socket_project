export interface IUser {
  id: string;
  username: string;
  status: string | null;
}

export interface IMessage {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
}

export interface IChatRoom {
  members: {
    id: string;
    username: string;
  }[];
  id: string;
  name: string;
  group: boolean;
}
