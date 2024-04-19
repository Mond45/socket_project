import { useSocket } from "@/lib/socket";
import { useState } from "react";

export default function Login() {
  const { socket } = useSocket();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl">Login</h1>
      <form
        className="flex flex-col gap-2 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          socket?.emit("client_login", {
            username,
            password,
          });
          // register
        }}
      >
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-slate-400 p-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
}
