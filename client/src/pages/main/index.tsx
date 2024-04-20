import ChatMessages from "@/components/ChatMessages";
import { useSocket } from "@/lib/socket";
import { useState } from "react";

export default function Main() {
  const { loggedUser, users, socket, rooms, messages } = useSocket();
  const filterdRoom = rooms?.filter((room) => {
    if (!room.group) {
      return room.members.map((m) => m.id).includes(loggedUser?.id ?? "");
    }
    return true;
  });
  const [groupName, setGroupName] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(
    undefined
  );
  const [status, setStatus] = useState<string>("");
  return (
    <div className="space-y-4 p-8">
      <div className="space-y-4">
        <p>Hello, {loggedUser?.username}</p>
        <input
          type="text"
          placeholder="Status"
          className="border border-gray-300 rounded p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button
          className="border border-gray-300 rounded p-2"
          onClick={() => {
            socket?.emit("client-set-status", {
              user_id: loggedUser?.id,
              status: status === "" ? null : status,
            });
          }}
        >
          Set
        </button>
      </div>
      <div>
        <h1 className="text-xl">Online Users</h1>
        {users?.map((user) => (
          <div className="space-x-2">
            <span key={user.id}>
              {user.username} {user.status ?? "ONLINE"}
            </span>
            {user.id != loggedUser?.id && (
              <button
                className="border border-gray-300 rounded p-2"
                onClick={() => {
                  socket?.emit("client-create-dm", {
                    user1: loggedUser,
                    user2: user,
                  });
                }}
              >
                Create DM
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="space-x-2">
        <h1 className="text-xl">Create group</h1>
        <input
          type="text"
          placeholder="Group Name"
          className="border border-gray-300 rounded p-2"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button
          className="border border-gray-300 rounded p-2"
          onClick={() => {
            socket?.emit("client-create-group", {
              name: groupName,
              members: [loggedUser?.id],
            });
          }}
        >
          Create
        </button>
      </div>
      <div>
        <h1 className="text-xl">Chat Rooms:</h1>
        {filterdRoom?.map((room) =>
          room.group ? (
            <div key={room.id} className="space-x-6 space-y-2">
              <span>{room.name}</span>
              {!room.members
                .map((m) => m.id)
                .includes(loggedUser?.id ?? "") && (
                <button
                  className="border border-gray-300 rounded p-2"
                  onClick={() => {
                    socket?.emit("client-join-room", {
                      userId: loggedUser?.id,
                      roomId: room.id,
                    });
                  }}
                >
                  Join Group
                </button>
              )}
            </div>
          ) : (
            <div key={room.id}>{room.name}</div>
          )
        )}
      </div>
      <div className="space-y-2">
        <h1 className="text-xl">Chat</h1>
        <select
          value={selectedRoom}
          className="p-2"
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <option value={""}>Select Room</option>
          {rooms
            ?.filter((room) => {
              return room.members
                .map((m) => m.id)
                .includes(loggedUser?.id ?? "");
            })
            .map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
        </select>
        {selectedRoom !== "" && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <ChatMessages
                messages={messages ?? {}}
                roomId={selectedRoom ?? ""}
              />
            </div>
            <input
              type="text"
              placeholder="Message"
              className="border border-gray-300 rounded p-2"
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
            />
            <button
              className="border border-gray-300 rounded p-2"
              onClick={() => {
                socket?.emit("client-send-message", {
                  roomId: selectedRoom,
                  userId: loggedUser?.id,
                  content: chatMsg,
                });
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
