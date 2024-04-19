import { useSocket } from "@/lib/socket";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
  const { socket } = useSocket();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl">Register</h1>
      <form
        className="flex flex-col gap-2 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          socket?.emit("client-register", {
            username,
            password,
          });
          navigate("/");
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
          Register
        </button>
      </form>
    </div>
  );
}
