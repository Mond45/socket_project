import { useState } from "react";
import { useSocket } from "@/lib/socket";

export default function Page() {
  const { socket, messages } = useSocket();
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-2 p-8">
      <div>
        {messages?.map((msg) => (
          <p key={msg}>{msg}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
        <button
          onClick={() => {
            socket?.emit("client-send-message", { message: text });
            setText("");
          }}
          className="bg-slate-400 p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
