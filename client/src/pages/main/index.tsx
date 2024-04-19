import { useSocket } from "@/lib/socket";

export default function Main() {
  const { users } = useSocket();

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>
          {user.id} {user.username}
        </div>
      ))}
    </div>
  );
}
