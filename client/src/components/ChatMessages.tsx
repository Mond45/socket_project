import { useSocket } from "@/lib/socket";
import { IMessage } from "@common/types";
import dayjs from "dayjs";

export default function ChatMessages({
  messages,
  roomId,
}: {
  messages: Record<string, IMessage[]>;
  roomId: string;
}) {
  const { socket, loggedUser } = useSocket();
  const msgs = messages[roomId];
  return (
    <div className="my-4">
      {msgs &&
        msgs.map((message) => (
          <div
            key={message.id}
            className="flex group gap-2 items-center cursor-pointer"
          >
            <span className="group-hover:text-slate-600">
              <div className="inline font-bold text-blue-500">
                {message.user.username}
              </div>
              <div className="inline">
                : {message.content}
              </div>
            </span>
            {message.user.id === loggedUser?.id && (
              <button
                className="collapse group-hover:visible border border-gray-300 rounded p-1.5 bg-red-500 text-gray-50 text-xs"
                onClick={() => {
                  socket?.emit("client-unsend-message", {
                    message_id: message.id,
                    room_id: roomId,
                  });
                }}
              >
                Unsend
              </button>
            )}
            <span className="grow text-right text-gray-400 group-hover:text-gray-600 overflow-ellipsis ">
              {dayjs(message.createdAt).format("DD/MM HH:mm")}
            </span>
          </div>
        ))}
    </div>
  );
}
