import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SOCKET_URL = "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: { [key: string]: boolean }; // Object mapping userId to true
  setOnlineUsers: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

// Create the Socket Context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: {}, // Default empty object
  setOnlineUsers: () => {}, // No-op function
});

// Provider Component
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"], // Force WebSocket only (Avoids CORS issues)
    });

    newSocket.on("connect", () => {
      newSocket.emit("registerUser", userId);
      console.log("✅ Connected to Socket Server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });

    // 1️⃣ Initialize online users list
    const handleOnlineFriends = (friends: string[]) => {
      const usersObject = Object.fromEntries(friends.map((id) => [id, true]));
      setOnlineUsers(usersObject);
    };

    // 2️⃣ Add a new online user
    const handleUserOnline = (newUserId: string) => {
      setOnlineUsers((prev) => ({ ...prev, [newUserId]: true }));
    };

    // 3️⃣ Remove an offline user
    const handleUserOffline = (userId: string) => {
      setOnlineUsers((prev) => {
        const updatedUsers = { ...prev };
        delete updatedUsers[userId];
        return updatedUsers;
      });
    };

    newSocket.on("onlineFriends", handleOnlineFriends);
    newSocket.on("userOnline", handleUserOnline);
    newSocket.on("userOffline", handleUserOffline);

    setSocket(newSocket);

    // 1️⃣ Initialize online users
    newSocket.on("onlineFriends", (friends: string[]) => {
      const usersObject = Object.fromEntries(friends.map((id) => [id, true]));
      setOnlineUsers(usersObject);
    });

    // 2️⃣ Add new online user
    newSocket.on("userOnline", (newUserId: string) => {
      setOnlineUsers((prev) => ({ ...prev, [newUserId]: true }));
    });

    // 3️⃣ Remove offline user
    newSocket.on("userOffline", (userId: string) => {
      setOnlineUsers((prev) => {
        const updatedUsers = { ...prev };
        delete updatedUsers[userId];
        return updatedUsers;
      });
    });

    return () => {
      newSocket.off("onlineFriends", handleOnlineFriends);
      newSocket.off("userOnline", handleUserOnline);
      newSocket.off("userOffline", handleUserOffline);
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, setOnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom Hook
export const useSocket = () => useContext(SocketContext);
