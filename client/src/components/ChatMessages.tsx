import { useSocket } from "@/lib/socket";
import { IMessage } from "@common/types";

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
    <div>
      {msgs &&
        msgs.map((message) => (
          <div key={message.id} className="space-x-2 space-y-2">
            <span>
              {message.user.username}: {message.content}
            </span>
            {message.user.id === loggedUser?.id && (
              <button
                className="border border-gray-300 rounded p-2"
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
          </div>
        ))}
    </div>
  );
}
