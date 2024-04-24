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
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  if (!loggedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <a href="/login" className="text-3xl underline">
          Please Login 😮‍💨
        </a>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-8 max-w-2xl bg-slate-200 mx-auto min-h-screen">
      <div className="space-y-1">
        <p className="text-4xl">Hello, {loggedUser?.username} 😁</p>
        <form
          className="space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            socket?.emit("client-set-status", {
              user_id: loggedUser?.id,
              status: status === "" ? null : status,
            });
            setStatus("");
          }}
        >
          <input
            type="text"
            placeholder="how's your day?"
            className="border border-gray-300 rounded p-1.5"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <button
            className="border bg-blue-300 rounded-md pl-1.5 pr-1.5 pt-1 pb-1"
            type="submit"
          >
            set status
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-2xl mb-2">Online Users</h1>
        {users?.map((user) => (
          <div className="space-x-2">
            <span key={user.id}>
              <div className="inline">
                {user.username} 
              </div>
              <div className={`inline ml-2 ${user.status ? "text-[#80669d]" : "text-green-500"}`}>
                [{user.status ?? "ONLINE"}]
              </div>
            </span>
            {user.id != loggedUser?.id && (
              <button
                className="p-1 bg-blue-300 rounded-md font-bold text-sm"
                onClick={() => {
                  socket?.emit("client-create-dm", {
                    user1: loggedUser,
                    user2: user,
                  });
                }}
              >
                DM
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl mb-2">Create group</h1>
        <form
          className="space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (groupName === "") {
              alert("Please enter group name.");
              return;
            }
            socket?.emit("client-create-group", {
              name: groupName,
              members: [loggedUser?.id],
            });
            setGroupName("");
          }}
        >
          <input
            type="text"
            placeholder="Group Name"
            className="border border-gray-300 rounded p-1.5"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="bg-blue-300 rounded-md pl-1.5 pr-1.5 pt-1 pb-1"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-2xl mb-2">Chat Rooms:</h1>
        {filterdRoom?.map((room) =>
          room.group ? (
            <div key={room.id} className="space-x-4 space-y-2">
              <span>{room.name}</span>
              {!room.members
                .map((m) => m.id)
                .includes(loggedUser?.id ?? "") && (
                <button
                  className="bg-blue-300 rounded-md pl-1.5 pr-1.5 pt-1 pb-1"
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
        <h1 className="text-2xl">Chat</h1>
        <select
          value={selectedRoom}
          className="p-2 bg-white rounded-md"
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
          <div className="space-y-1 w-full border-t border-gray-300 pt-2">
            <div className="space-y-2">
              <ChatMessages
                messages={messages ?? {}}
                roomId={selectedRoom ?? ""}
              />
            </div>
            <form
              className="space-x-2 w-100vw border-t border-gray-300 pt-2 flex justify-between items-center"
              onSubmit={(e) => {
                e.preventDefault();
                socket?.emit("client-send-message", {
                  roomId: selectedRoom,
                  userId: loggedUser?.id,
                  content: chatMsg,
                });
                setChatMsg("");
              }}
            >
              <input
                type="text"
                placeholder="Message"
                className="border border-gray-300 rounded p-1.5 w-full"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
              />
              <button
                className="border border-gray-300 rounded p-1.5 bg-white"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
