import { useContext } from "react";
import { SocketContext } from "@/socketProvider";

export const useSocket = () => useContext(SocketContext);
